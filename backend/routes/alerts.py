"""
Smart Electricity Bill Predictor - Alert Notification Routes
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models_db import Alert, Household

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

@router.post("/trigger-demo-alert/{household_id}")
def trigger_demo_alert(household_id: int, db: Session = Depends(get_db)):
    """Utility endpoint to inject a realistic demo alert for judges."""
    new_alert = Alert(
        household_id=household_id,
        date=datetime.utcnow().strftime("%Y-%m-%d"),
        alert_type="OVERAGE_WARNING",
        title="⚠️ Mid-Month AC Overage Warning (+28% above budget)",
        message="Day 14 Forecast: Heavy AC usage (8.5 hrs/day) has placed your monthly projection at 460 kWh (~₹3,950), exceeding your ₹3,100 budget by ₹850. Adjusting thermostat to 24°C will recover ₹420.",
        severity="danger",
        projected_bill=3950.0,
        budget_amount=3100.0,
        acknowledged=False
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return {"message": "Demo alert injected", "alert_id": new_alert.id}
