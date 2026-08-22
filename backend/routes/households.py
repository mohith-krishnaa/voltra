"""
Smart Electricity Bill Predictor - Multi-Household Management Routes
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models_db import Household, User
from backend.utils.security import get_current_user_optional

router = APIRouter(prefix="/api/households", tags=["households"])

class HouseholdCreate(BaseModel):
    name: str = "My Residence"
    house_type: str = "Apartment-2BHK"
    area_sqft: float = 1100.0
    occupants: int = 3
    tariff_zone: str = "Tiered-Standard"
    monthly_budget_inr: float = 3200.0
    monthly_budget_units: float = 350.0

class HouseholdUpdate(BaseModel):
    name: Optional[str] = None
    house_type: Optional[str] = None
    area_sqft: Optional[float] = None
    occupants: Optional[int] = None
    tariff_zone: Optional[str] = None
    monthly_budget_inr: Optional[float] = None
    monthly_budget_units: Optional[float] = None


@router.get("")
def list_households(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Lists households owned by user (or default demo households)."""
    user_id = current_user.id if current_user else 1
    households = db.query(Household).filter(Household.user_id == user_id).all()
    
    if not households and not current_user:
        # Seed default demo household
        default_hh = Household(
            id=1,
            user_id=1,
            name="Primary Home (2BHK)",
            house_type="Apartment-2BHK",
            area_sqft=1150.0,
            occupants=3,
            tariff_zone="Tiered-Standard",
            monthly_budget_inr=3200.0,
            monthly_budget_units=350.0
        )
        db.add(default_hh)
        db.commit()
        db.refresh(default_hh)
        households = [default_hh]
        
    return [
        {
            "id": h.id,
            "name": h.name,
            "house_type": h.house_type,
            "area_sqft": h.area_sqft,
            "occupants": h.occupants,
            "tariff_zone": h.tariff_zone,
            "monthly_budget_inr": h.monthly_budget_inr,
            "monthly_budget_units": h.monthly_budget_units,
            "created_at": h.created_at.isoformat() if h.created_at else None
        }
        for h in households
    ]


@router.post("")
def create_household(
    payload: HouseholdCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Creates a new household for multi-home tracking."""
    user_id = current_user.id if current_user else 1
    new_hh = Household(
        user_id=user_id,
        name=payload.name,
        house_type=payload.house_type,
        area_sqft=payload.area_sqft,
        occupants=payload.occupants,
        tariff_zone=payload.tariff_zone,
        monthly_budget_inr=payload.monthly_budget_inr,
        monthly_budget_units=payload.monthly_budget_units
    )
    db.add(new_hh)
    db.commit()
    db.refresh(new_hh)
    return {
        "id": new_hh.id,
        "name": new_hh.name,
        "house_type": new_hh.house_type,
        "tariff_zone": new_hh.tariff_zone,
        "monthly_budget_inr": new_hh.monthly_budget_inr,
        "monthly_budget_units": new_hh.monthly_budget_units
    }


@router.put("/{household_id}")
def update_household(
    household_id: int,
    payload: HouseholdUpdate,
    db: Session = Depends(get_db)
):
    """Updates household parameters or budget."""
    hh = db.query(Household).filter(Household.id == household_id).first()
    if not hh:
        raise HTTPException(status_code=404, detail="Household not found")
        
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(hh, k, v)
        
    db.commit()
    db.refresh(hh)
    return {"message": "Household updated successfully", "id": hh.id}


@router.delete("/{household_id}")
def delete_household(household_id: int, db: Session = Depends(get_db)):
    """Deletes a household."""
    hh = db.query(Household).filter(Household.id == household_id).first()
    if not hh:
        raise HTTPException(status_code=404, detail="Household not found")
    db.delete(hh)
    db.commit()
    return {"message": "Household deleted successfully"}
