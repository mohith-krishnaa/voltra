"""
Smart Electricity Bill Predictor - Adaptive Engine & Budget Pace Monitoring
"""

import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.models_db import Household, DailyLog, Alert
from backend.tariff import calculate_bill_from_units
from model.train_daily_model import project_remaining_month

def compute_household_adaptive_status(household: Household, db: Session, total_days_in_month: int = 30) -> Dict[str, Any]:
    """
    Retrieves all daily logs for the household's current billing cycle,
    runs the adaptive forecaster, evaluates budget thresholds, and syncs alerts.
    """
    logs = db.query(DailyLog).filter(DailyLog.household_id == household.id).order_by(DailyLog.date.asc()).all()
    
    logged_data = []
    for idx, log in enumerate(logs, start=1):
        logged_data.append({
            "day": idx,
            "date": log.date,
            "daily_kwh": log.daily_kwh,
            "is_weekend": False
        })
        
    baseline_units = household.monthly_budget_units or 350.0
    
    adaptive_res = project_remaining_month(
        logged_days_data=logged_data,
        household_profile={"season": "Summer", "house_type": household.house_type},
        baseline_monthly_kwh=baseline_units,
        total_days_in_month=total_days_in_month
    )
    
    # Calculate tariff bill for projected units
    projected_units = adaptive_res["total_projected_units"]
    bill_info = calculate_bill_from_units(projected_units, tariff_zone=household.tariff_zone)
    projected_bill = bill_info["total_bill"]
    
    current_spent_bill = calculate_bill_from_units(adaptive_res["units_so_far"], tariff_zone=household.tariff_zone)["total_bill"]
    
    # Evaluate overage vs user budget
    budget_inr = household.monthly_budget_inr or 3000.0
    budget_variance_inr = round(projected_bill - budget_inr, 2)
    budget_variance_percent = round((budget_variance_inr / budget_inr) * 100.0, 1) if budget_inr > 0 else 0.0
    
    # Auto-generate or update Alert records
    active_alerts = []
    if adaptive_res["days_logged"] >= 3:
        if budget_variance_percent > 15.0:
            alert_title = f"⚠️ Mid-Month Over-Budget Warning (+{budget_variance_percent}%)"
            alert_msg = (
                f"Based on your last {min(7, adaptive_res['days_logged'])} days of usage, you are trending toward "
                f"{projected_units} kWh (~{bill_info['currency_symbol']}{projected_bill:.0f}), which exceeds your "
                f"budget of {bill_info['currency_symbol']}{budget_inr:.0f} by {bill_info['currency_symbol']}{budget_variance_inr:.0f}."
            )
            active_alerts.append({
                "type": "OVERAGE_WARNING",
                "title": alert_title,
                "message": alert_msg,
                "severity": "danger" if budget_variance_percent > 30 else "warning"
            })
        elif adaptive_res["pace_status"] == "SAVING_ENERGY":
            alert_title = f"🎉 Energy Saver Pace (Saving ~{abs(budget_variance_percent)}%)"
            alert_msg = f"Great job! Your current pace is projected at {projected_units} kWh ({bill_info['currency_symbol']}{projected_bill:.0f}), under your budget by {bill_info['currency_symbol']}{abs(budget_variance_inr):.0f}."
            active_alerts.append({
                "type": "SAVING_PACE",
                "title": alert_title,
                "message": alert_msg,
                "severity": "success"
            })

    return {
        "household_id": household.id,
        "household_name": household.name,
        "days_logged": adaptive_res["days_logged"],
        "days_remaining": adaptive_res["days_remaining"],
        "units_month_to_date": adaptive_res["units_so_far"],
        "cost_month_to_date": current_spent_bill,
        "projected_total_units": projected_units,
        "projected_total_bill": projected_bill,
        "budget_inr": budget_inr,
        "budget_units": baseline_units,
        "budget_variance_inr": budget_variance_inr,
        "budget_variance_percent": budget_variance_percent,
        "pace_status": adaptive_res["pace_status"],
        "pace_percentage": adaptive_res["pace_percentage"],
        "confidence": adaptive_res["confidence"],
        "currency_symbol": bill_info["currency_symbol"],
        "bill_details": bill_info,
        "daily_logs": logged_data,
        "generated_alerts": active_alerts
    }
