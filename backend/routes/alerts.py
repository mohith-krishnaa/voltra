"""
Smart Electricity Bill Predictor - Alert Notification & WhatsApp / SMS Dispatch Routes
"""

from __future__ import annotations
import urllib.parse
from typing import List, Optional
import datetime
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models_db import Alert, Household, get_utc_now

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

class AlertResponse(BaseModel):
    id: int
    household_id: int
    date: str
    alert_type: str
    title: str
    message: str
    severity: str
    projected_bill: Optional[float]
    budget_amount: Optional[float]
    acknowledged: bool
    created_at: Optional[str]

class WhatsAppAlertRequest(BaseModel):
    phone_number: Optional[str] = Field(default="9849012345", description="10-digit Indian mobile number")
    household_name: str = "My Home"
    predicted_units: float = 324.3
    predicted_bill: float = 2108.16
    tariff_zone: str = "TGSPDCL-Telangana"
    alert_type: str = "MID_MONTH_PACE" # "SUBSIDY_RISK", "MID_MONTH_PACE", "SLAB_CROSSING"
    advice: Optional[str] = "Increase AC set temperature to 24°C to save ~₹420."

@router.get("/{household_id}")
def get_household_alerts(household_id: int, db: Session = Depends(get_db)):
    """Fetches all active alerts for the given household."""
    alerts = db.query(Alert).filter(Alert.household_id == household_id).order_by(Alert.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "household_id": a.household_id,
            "date": a.date,
            "alert_type": a.alert_type,
            "title": a.title,
            "message": a.message,
            "severity": a.severity,
            "projected_bill": a.projected_bill,
            "budget_amount": a.budget_amount,
            "acknowledged": a.acknowledged,
            "created_at": a.created_at.isoformat() if a.created_at else None
        }
        for a in alerts
    ]

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    """Marks an alert as acknowledged."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.acknowledged = True
    db.commit()
    return {"message": "Alert acknowledged", "id": alert_id}

@router.post("/send-whatsapp")
def generate_whatsapp_alert(payload: WhatsAppAlertRequest):
    """
    Generates a high-priority WhatsApp notification payload and instant Click-to-Chat deep-link.
    """
    clean_phone = "".join(filter(str.isdigit, payload.phone_number or "9849012345"))
    if len(clean_phone) == 10:
        clean_phone = "91" + clean_phone
    elif not clean_phone.startswith("91") and len(clean_phone) > 10:
        clean_phone = "91" + clean_phone[-10:]

    # Format official Voltra alert message
    if payload.alert_type == "SUBSIDY_RISK":
        text = (
            f"⚡ *VOLTRA ALERT: 200-Unit Subsidy Cliff Warning*\n\n"
            f"📍 *Connection:* {payload.household_name} ({payload.tariff_zone.split('-')[0]})\n"
            f"📊 *Current Month Forecast:* {payload.predicted_units:.1f} kWh (~₹{payload.predicted_bill:.2f})\n"
            f"⚠️ *Risk:* Consuming >200 units will *disqualify* your household from the zero-bill Gruha Jyothi subsidy.\n\n"
            f"💡 *Actionable Advice:* {payload.advice}\n\n"
            f"— Track live on Voltra Energy App: https://voltra.netlify.app"
        )
    else:
        text = (
            f"⚡ *VOLTRA ENERGY ALERT: Mid-Month Power Spike*\n\n"
            f"📍 *Household:* {payload.household_name} ({payload.tariff_zone.split('-')[0]})\n"
            f"📈 *Projected Bill:* ₹{payload.predicted_bill:.2f} ({payload.predicted_units:.1f} kWh)\n"
            f"💡 *Energy Saving Tip:* {payload.advice}\n\n"
            f"— Sent via Voltra AI Energy Intelligence: https://voltra.netlify.app"
        )

    encoded_text = urllib.parse.quote(text)
    whatsapp_url = f"https://api.whatsapp.com/send?phone={clean_phone}&text={encoded_text}"
    whatsapp_web_url = f"https://web.whatsapp.com/send?phone={clean_phone}&text={encoded_text}"

    return {
        "status": "QUEUED_AND_READY",
        "recipient": clean_phone,
        "raw_message": text,
        "whatsapp_url": whatsapp_url,
        "whatsapp_web_url": whatsapp_web_url,
        "timestamp": get_utc_now().isoformat()
    }

@router.post("/send-sms")
def send_sms_alert(payload: WhatsAppAlertRequest):
    """
    Simulates telecom SMS gateway dispatch for high-priority utility overage warnings.
    """
    clean_phone = "".join(filter(str.isdigit, payload.phone_number or "9849012345"))
    sms_text = f"VOLTRA ALERT: {payload.household_name} is tracking at {payload.predicted_units:.1f} kWh (₹{payload.predicted_bill:.2f}). {payload.advice}"
    return {
        "status": "DELIVERED",
        "message_id": f"SMS_{int(datetime.datetime.now().timestamp())}",
        "phone": clean_phone,
        "content": sms_text[:160],
        "delivered_at": get_utc_now().isoformat()
    }

@router.post("/trigger-demo-alert/{household_id}")
def trigger_demo_alert(household_id: int, db: Session = Depends(get_db)):
    """Utility endpoint to inject a realistic demo alert for users."""
    new_alert = Alert(
        household_id=household_id,
        date=datetime.date.today().strftime("%Y-%m-%d"),
        alert_type="OVERAGE_WARNING",
        title="⚠️ Mid-Month AC Overage Warning (+28% above budget)",
        message="Day 14 Forecast: Heavy AC usage (8.5 hrs/day) has placed your monthly projection at 460 kWh (~₹3,950), exceeding your ₹3,100 budget by ₹850. Adjusting thermostat to 24°C will recover ₹420.",
        severity="danger",
        projected_bill=3950.0,
        budget_amount=3100.0,
        acknowledged=False,
        created_at=get_utc_now()
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return {"message": "Demo alert injected", "alert_id": new_alert.id}
