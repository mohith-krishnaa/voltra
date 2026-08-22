"""
Smart Electricity Bill Predictor - SQLAlchemy Data Models
"""

import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), default="Eco User")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    households = relationship("Household", back_populates="owner", cascade="all, delete-orphan")


class Household(Base):
    __tablename__ = "households"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), default="Primary Residence")
    house_type = Column(String(50), default="Apartment-2BHK")
    area_sqft = Column(Float, default=1100.0)
    occupants = Column(Integer, default=3)
    tariff_zone = Column(String(50), default="Tiered-Standard")
    monthly_budget_inr = Column(Float, default=3500.0)
    monthly_budget_units = Column(Float, default=400.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="households")
    daily_logs = relationship("DailyLog", back_populates="household", cascade="all, delete-orphan")
    predictions = relationship("PredictionRecord", back_populates="household", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="household", cascade="all, delete-orphan")


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(Integer, ForeignKey("households.id"), nullable=False, index=True)
    date = Column(String(10), nullable=False, index=True) # YYYY-MM-DD
    daily_kwh = Column(Float, nullable=False)
    appliances_json = Column(Text, nullable=False) # JSON dictionary of appliance usages
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    household = relationship("Household", back_populates="daily_logs")


class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(Integer, ForeignKey("households.id"), nullable=False, index=True)
    month = Column(String(7), nullable=False, index=True) # YYYY-MM
    season = Column(String(30), default="Summer")
    predicted_units = Column(Float, nullable=False)
    predicted_bill = Column(Float, nullable=False)
    actual_units = Column(Float, nullable=True)
    actual_bill = Column(Float, nullable=True)
    breakdown_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    household = relationship("Household", back_populates="predictions")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(Integer, ForeignKey("households.id"), nullable=False, index=True)
    date = Column(String(10), nullable=False) # YYYY-MM-DD
    alert_type = Column(String(50), nullable=False) # OVERAGE_WARNING, SLAB_CROSSING, etc.
    title = Column(String(120), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(20), default="warning") # warning, danger, success, info
    projected_bill = Column(Float, nullable=True)
    budget_amount = Column(Float, nullable=True)
    household = relationship("Household", back_populates="alerts")


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, index=True)
    tx_id = Column(String(64), unique=True, index=True, nullable=False)
    usc_number = Column(String(50), nullable=False, index=True)
    consumer_name = Column(String(120), nullable=False)
    discom = Column(String(80), nullable=False)
    billing_month = Column(String(20), nullable=False)
    units_kwh = Column(Float, nullable=False)
    amount_inr = Column(Float, nullable=False)
    discount_inr = Column(Float, default=0.0)
    net_paid_inr = Column(Float, nullable=False)
    payment_method = Column(String(50), default="UPI")
    payment_status = Column(String(30), default="SUCCESS") # SUCCESS, PENDING, FAILED
    promo_code = Column(String(30), nullable=True)
    receipt_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

