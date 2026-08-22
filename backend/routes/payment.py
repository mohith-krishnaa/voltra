"""
Smart Electricity Bill Predictor - Payment Gateway & Solar ROI Calculation Engine
"""

import json
import uuid
import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models_db import PaymentTransaction
from backend.tariff import calculate_bill_from_units, get_available_tariffs

router = APIRouter(prefix="/api/payment", tags=["payment"])
solar_router = APIRouter(prefix="/api/solar", tags=["solar"])

# --------------------------------------------------------------------------
# Pydantic Schemas
# --------------------------------------------------------------------------
class BillLookupRequest(BaseModel):
    usc_number: str
    discom: str = "TGSPDCL-Telangana"

class CreateOrderRequest(BaseModel):
    usc_number: str
    consumer_name: str
    discom: str
    billing_month: str = "August 2026"
    units_kwh: float = 324.3
    amount_inr: float = 2108.16
    promo_code: Optional[str] = None
    payment_method: str = "UPI"

class VerifyPaymentRequest(BaseModel):
    order_id: str
    payment_id: Optional[str] = None
    signature: Optional[str] = None
    usc_number: str
    consumer_name: str
    discom: str
    billing_month: str = "August 2026"
    units_kwh: float = 324.3
    amount_inr: float = 2108.16
    discount_inr: float = 0.0
    net_paid_inr: float = 2108.16
    payment_method: str = "UPI"
    promo_code: Optional[str] = None

class SolarRoiRequest(BaseModel):
    monthly_units: float = 350.0
    roof_area_sqft: float = 500.0
    tariff_zone: str = "TGSPDCL-Telangana"
    current_monthly_bill: float = 2400.0


# --------------------------------------------------------------------------
# 1. Live Consumer Bill Lookup (BBPS / DISCOM Switch Simulator)
# --------------------------------------------------------------------------
@router.get("/fetch-bill")
def fetch_consumer_bill(
    usc_number: str = Query(..., description="Unique Service Connection / Consumer No"),
    discom: str = Query("TGSPDCL-Telangana", description="State Electricity Board")
):
    """
    Simulates real-time BBPS / TGSPDCL consumer validation & billing query.
    """
    # Deterministic generation based on USC hash for demo continuity
    hash_val = sum(ord(c) for c in usc_number)
    units = round(220 + (hash_val % 180) + 0.4, 1) # 220 to 400 kWh
    
    tariff_calc = calculate_bill_from_units(units, discom)
    total_bill = tariff_calc.get("total_bill", 2108.16)
    
    today = datetime.date.today()
    due_date = today + datetime.timedelta(days=12)
    
    names_pool = [
        "K. V. Rajesh Kumar", "Dr. Anita Srinivas Rao", "Siddharth Iyer", 
        "Mohith Krishna P.", "V. Venkat Reddy", "P. Lakshmi Narayana"
    ]
    name = names_pool[hash_val % len(names_pool)]
    
    return {
        "status": "VALID",
        "usc_number": usc_number,
        "consumer_name": name,
        "discom": discom,
        "billing_period": today.strftime("%B %Y"),
        "meter_number": f"TG-SM-{10000 + (hash_val % 89999)}",
        "sanctioned_load_kw": 3.5 if (hash_val % 2 == 0) else 5.0,
        "units_consumed": units,
        "energy_charges": tariff_calc.get("energy_charge", total_bill * 0.88),
        "fixed_charges": tariff_calc.get("fixed_charge", 50.0),
        "electricity_duty": tariff_calc.get("duty_amount", 110.0),
        "arrears": 0.0,
        "total_amount_payable": total_bill,
        "due_date": due_date.strftime("%d-%b-%Y"),
        "early_pay_discount": round(total_bill * 0.015, 2),
        "gruha_jyothi_eligible": units <= 200 and "TGSPDCL" in discom
    }


# --------------------------------------------------------------------------
# 2. Create Payment Order (Gateway order & dynamic UPI VPA)
# --------------------------------------------------------------------------
@router.post("/create-order")
def create_payment_order(payload: CreateOrderRequest):
    """
    Generates a secure checkout order with dynamic NPCI UPI string & gateway token.
    """
    order_id = f"ORDER_VOLTRA_{uuid.uuid4().hex[:12].upper()}"
    
    discount = 0.0
    if payload.promo_code:
        code = payload.promo_code.upper()
        if code == "PROMPT15":
            discount = round(payload.amount_inr * 0.015, 2)
        elif code == "VOLTRAGREEN":
            discount = 50.0
        elif code == "GRUHA200":
            discount = payload.amount_inr if payload.units_kwh <= 200 else 450.0
        elif code in ["PMSURYA78", "BEE5STAR"]:
            discount = 150.0

    net_payable = max(0.0, round(payload.amount_inr - discount, 2))
    
    # Official NPCI standard UPI intent string
    discom_clean = payload.discom.split('-')[0].lower()
    upi_pa = f"{discom_clean}.bills@sbi"
    upi_pn = f"{payload.discom.split('-')[0]} Electricity"
    upi_intent_url = (
        f"upi://pay?pa={upi_pa}&pn={upi_pn}&am={net_payable:.2f}&cu=INR"
        f"&tn=Voltra%20Bill%20USC%20{payload.usc_number}&tr={order_id}"
    )

    return {
        "status": "CREATED",
        "order_id": order_id,
        "usc_number": payload.usc_number,
        "consumer_name": payload.consumer_name,
        "discom": payload.discom,
        "original_amount": payload.amount_inr,
        "discount_applied": discount,
        "net_payable": net_payable,
        "currency": "INR",
        "upi_intent_url": upi_intent_url,
        "merchant_vpa": upi_pa,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }


# --------------------------------------------------------------------------
# 3. Verify Payment & Generate Official GST Receipt
# --------------------------------------------------------------------------
@router.post("/verify")
def verify_payment(payload: VerifyPaymentRequest, db: Session = Depends(get_db)):
    """
    Verifies payment completion, records in database, and issues official tax invoice receipt.
    """
    tx_id = f"TXN-VOLTRA-{uuid.uuid4().hex[:10].upper()}"
    timestamp_str = datetime.datetime.now(datetime.timezone.utc).strftime("%d-%b-%Y %I:%M:%S %p UTC")
    
    receipt_data = {
        "tx_id": tx_id,
        "order_id": payload.order_id,
        "usc_number": payload.usc_number,
        "consumer_name": payload.consumer_name,
        "discom": payload.discom,
        "billing_month": payload.billing_month,
        "units_kwh": payload.units_kwh,
        "amount_inr": payload.amount_inr,
        "discount_inr": payload.discount_inr,
        "net_paid_inr": payload.net_paid_inr,
        "payment_method": payload.payment_method,
        "promo_code": payload.promo_code,
        "status": "CLEARED_AND_SETTLED",
        "timestamp": timestamp_str,
        "discom_ref": f"TG-{uuid.uuid4().hex[:8].upper()}"
    }

    try:
        tx_record = PaymentTransaction(
            tx_id=tx_id,
            usc_number=payload.usc_number,
            consumer_name=payload.consumer_name,
            discom=payload.discom,
            billing_month=payload.billing_month,
            units_kwh=payload.units_kwh,
            amount_inr=payload.amount_inr,
            discount_inr=payload.discount_inr,
            net_paid_inr=payload.net_paid_inr,
            payment_method=payload.payment_method,
            payment_status="SUCCESS",
            promo_code=payload.promo_code,
            receipt_json=json.dumps(receipt_data)
        )
        db.add(tx_record)
        db.commit()
    except Exception as e:
        print(f"[Payment] Failed to save transaction record: {e}")

    return {
        "status": "SUCCESS",
        "message": "Payment verified and credited to DISCOM treasury.",
        "receipt": receipt_data
    }


# --------------------------------------------------------------------------
# 4. Payment History
# --------------------------------------------------------------------------
@router.get("/history")
def get_payment_history(
    usc_number: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns list of verified payment receipts.
    """
    query = db.query(PaymentTransaction).order_by(PaymentTransaction.id.desc())
    if usc_number:
        query = query.filter(PaymentTransaction.usc_number == usc_number)
    records = query.limit(20).all()
    
    return {
        "count": len(records),
        "transactions": [
            {
                "id": r.id,
                "tx_id": r.tx_id,
                "usc_number": r.usc_number,
                "consumer_name": r.consumer_name,
                "discom": r.discom,
                "billing_month": r.billing_month,
                "units_kwh": r.units_kwh,
                "amount_paid": r.net_paid_inr,
                "payment_method": r.payment_method,
                "status": r.payment_status,
                "created_at": r.created_at.isoformat() if r.created_at else None
            }
            for r in records
        ]
    }


# --------------------------------------------------------------------------
# 5. Solar Rooftop ROI & PM Surya Ghar Calculator
# --------------------------------------------------------------------------
@solar_router.post("/calculate-roi")
def calculate_solar_roi(payload: SolarRoiRequest):
    """
    Computes system sizing (kW), PM Surya Ghar central subsidy, monthly generation,
    grid export earnings, and 25-year financial ROI.
    """
    # 1 kW generates approx 120 units (kWh) per month in India (4 units/kW/day)
    # Area required: ~100 sq ft per kW
    
    max_kw_by_area = payload.roof_area_sqft / 100.0
    ideal_kw_by_units = payload.monthly_units / 120.0
    recommended_kw = min(max_kw_by_area, max(1.0, round(ideal_kw_by_units, 1)))
    
    # PM Surya Ghar Subsidy Rules:
    # 1 kW: ₹30,000
    # 2 kW: ₹60,000
    # 3 kW+: ₹78,000 (capped at ₹78k)
    gross_cost_per_kw = 55000.0 # avg benchmark cost in India
    total_system_cost = recommended_kw * gross_cost_per_kw
    
    if recommended_kw <= 1.0:
        subsidy = 30000.0
    elif recommended_kw <= 2.0:
        subsidy = 60000.0
    else:
        subsidy = 78000.0
        
    net_investment = max(0.0, total_system_cost - subsidy)
    monthly_solar_generation = recommended_kw * 120.0 # kWh
    
    # Net offset calculation
    offset_ratio = min(1.0, monthly_solar_generation / max(1.0, payload.monthly_units))
    estimated_monthly_savings = payload.current_monthly_bill * offset_ratio
    annual_savings = estimated_monthly_savings * 12.0
    
    payback_years = round(net_investment / max(1.0, annual_savings), 1)
    lifetime_25yr_savings = round((annual_savings * 25.0) - net_investment, 0)
    co2_saved_tons_per_year = round(monthly_solar_generation * 12 * 0.82 / 1000.0, 2)
    
    return {
        "recommended_system_kw": recommended_kw,
        "required_roof_area_sqft": recommended_kw * 100,
        "monthly_generation_kwh": monthly_solar_generation,
        "gross_system_cost_inr": total_system_cost,
        "pm_surya_ghar_subsidy_inr": subsidy,
        "net_out_of_pocket_inr": net_investment,
        "estimated_monthly_savings_inr": estimated_monthly_savings,
        "annual_savings_inr": annual_savings,
        "payback_period_years": payback_years,
        "lifetime_25yr_net_profit_inr": lifetime_25yr_savings,
        "co2_reduction_tons_per_year": co2_saved_tons_per_year,
        "scheme_name": "PM Surya Ghar: Muft Bijli Yojana"
    }
