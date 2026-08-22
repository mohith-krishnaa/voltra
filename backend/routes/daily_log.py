"""
Smart Electricity Bill Predictor - Daily Logging & Adaptive Tracking Endpoints
"""

import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models_db import Household, DailyLog, User
from backend.utils.security import get_current_user_optional
from backend.adaptive import compute_household_adaptive_status
from data.generate_dataset import APPLIANCE_SPECS

router = APIRouter(prefix="/api", tags=["daily_logs"])

class DailyLogCreate(BaseModel):
    household_id: int
    date: str # YYYY-MM-DD
    appliances: Optional[Dict[str, Dict[str, float]]] = None
    direct_kwh: Optional[float] = None
    notes: Optional[str] = None

def compute_daily_kwh(appliances: Dict[str, Dict[str, float]], season: str = "Summer") -> float:
    """Estimates daily kWh from appliance run hours for a single day."""
    if not appliances:
        return 0.0
        
    ac_season_mult = {"Summer": 1.35, "Monsoon": 1.0, "Winter": 0.35, "Spring": 0.8}.get(season, 1.0)
    geyser_season_mult = {"Summer": 0.30, "Monsoon": 0.9, "Winter": 1.60, "Spring": 0.7}.get(season, 1.0)
    fridge_season_mult = {"Summer": 1.20, "Monsoon": 1.0, "Winter": 0.85, "Spring": 0.95}.get(season, 1.0)
    fan_season_mult = {"Summer": 1.25, "Monsoon": 1.0, "Winter": 0.50, "Spring": 0.90}.get(season, 1.0)

    kwh = 0.0
    for app_key, data in appliances.items():
        count = float(data.get("count", 0))
        hours = float(data.get("hours", 0))
        if count <= 0 or hours <= 0:
            continue
            
        spec = APPLIANCE_SPECS.get(app_key, {"base_kw": 0.1})
        base_kw = spec["base_kw"]
        
        if app_key == "ac":
            kwh += count * (hours * ac_season_mult) * base_kw * 0.85
        elif app_key == "fridge":
            duty = spec.get("duty_cycle", 0.45) * fridge_season_mult
            kwh += count * (hours * duty) * base_kw
        elif app_key == "fan":
            kwh += count * (hours * fan_season_mult) * base_kw
        elif app_key == "geyser":
            kwh += count * (hours * geyser_season_mult) * base_kw
        else:
            kwh += count * hours * base_kw
            
    # Daily standby baseline
    kwh += 0.8
    return round(max(0.5, kwh), 2)


@router.post("/daily-logs")
def log_daily_usage(
    payload: DailyLogCreate, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Logs or updates an appliance usage entry for a specific day."""
    household = db.query(Household).filter(Household.id == payload.household_id).first()
    if not household:
        # Create a default demo household if none exists
        household = Household(
            id=payload.household_id,
            user_id=current_user.id if current_user else 1,
            name="Demo Home",
            house_type="Apartment-2BHK",
            area_sqft=1100,
            occupants=3,
            tariff_zone="Tiered-Standard",
            monthly_budget_inr=3200.0,
            monthly_budget_units=350.0
        )
        db.add(household)
        db.commit()
        db.refresh(household)

    if payload.direct_kwh is not None and payload.direct_kwh > 0:
        daily_kwh = round(float(payload.direct_kwh), 2)
    elif payload.appliances:
        daily_kwh = compute_daily_kwh(payload.appliances, season=household.house_type)
    else:
        daily_kwh = 12.5 # Default fallback

    # Check if a log already exists for this date
    existing_log = db.query(DailyLog).filter(
        DailyLog.household_id == household.id,
        DailyLog.date == payload.date
    ).first()

    app_json = json.dumps(payload.appliances or {})

    if existing_log:
        existing_log.daily_kwh = daily_kwh
        existing_log.appliances_json = app_json
        existing_log.notes = payload.notes or existing_log.notes
        db.commit()
        db.refresh(existing_log)
        saved_log = existing_log
    else:
        new_log = DailyLog(
            household_id=household.id,
            date=payload.date,
            daily_kwh=daily_kwh,
            appliances_json=app_json,
            notes=payload.notes
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        saved_log = new_log

    # Compute updated adaptive forecast
    status_summary = compute_household_adaptive_status(household, db)

    return {
        "message": "Daily log saved successfully",
        "log": {
            "id": saved_log.id,
            "date": saved_log.date,
            "daily_kwh": saved_log.daily_kwh,
            "notes": saved_log.notes
        },
        "adaptive_forecast": status_summary
    }


@router.get("/daily-logs/{household_id}")
def get_daily_logs(household_id: int, db: Session = Depends(get_db)):
    """Retrieves all daily logs for a household sorted chronologically."""
    logs = db.query(DailyLog).filter(DailyLog.household_id == household_id).order_by(DailyLog.date.asc()).all()
    return [
        {
            "id": log.id,
            "household_id": log.household_id,
            "date": log.date,
            "daily_kwh": log.daily_kwh,
            "appliances": json.loads(log.appliances_json) if log.appliances_json else {},
            "notes": log.notes,
            "created_at": log.created_at.isoformat() if log.created_at else None
        }
        for log in logs
    ]


@router.delete("/daily-logs/{log_id}")
def delete_daily_log(log_id: int, db: Session = Depends(get_db)):
    """Deletes a daily log record."""
    log = db.query(DailyLog).filter(DailyLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log entry not found")
    db.delete(log)
    db.commit()
    return {"message": "Log entry deleted successfully"}


@router.get("/forecast/adaptive/{household_id}")
def get_adaptive_forecast(household_id: int, db: Session = Depends(get_db)):
    """Calculates live adaptive forecast for the given household."""
    household = db.query(Household).filter(Household.id == household_id).first()
    if not household:
        # Create a default demo household if needed
        household = Household(
            id=household_id,
            user_id=1,
            name="Primary Home",
            house_type="Apartment-2BHK",
            area_sqft=1100,
            occupants=3,
            tariff_zone="Tiered-Standard",
            monthly_budget_inr=3200.0,
            monthly_budget_units=350.0
        )
        db.add(household)
        db.commit()
        db.refresh(household)

    return compute_household_adaptive_status(household, db)
