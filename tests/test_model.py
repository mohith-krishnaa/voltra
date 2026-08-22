"""
Tests for ML Dataset Generator, Model Pipeline & Adaptive Forecaster
"""

import os
import pytest
import pandas as pd
from data.generate_dataset import generate_dataset, calculate_physics_units
from model.train_daily_model import project_remaining_month

def test_physics_calculation():
    sample = {
        "season": "Summer",
        "house_type": "Apartment-2BHK",
        "area_sqft": 1100,
        "occupants": 3,
        "ac_count": 1,
        "ac_hours": 6.0,
        "fridge_count": 1,
        "fridge_hours": 24.0,
        "fan_count": 3,
        "fan_hours": 10.0,
        "light_count": 8,
        "light_hours": 6.0,
        "geyser_count": 1,
        "geyser_hours": 0.5,
        "washing_machine_count": 1,
        "washing_machine_hours": 1.0,
        "tv_count": 1,
        "tv_hours": 4.0,
        "microwave_count": 1,
        "microwave_hours": 0.5,
        "ev_charger_count": 0,
        "ev_charger_hours": 0.0,
        "computer_count": 1,
        "computer_hours": 6.0,
    }
    units = calculate_physics_units(sample)
    assert units > 150.0
    assert units < 900.0

def test_adaptive_forecaster_over_budget():
    """Testing that elevated daily usage triggers OVER_BUDGET_WARNING."""
    # 10 days of 22 kWh/day with a 300 unit budget -> ~660 projected
    logs = [{"day": i, "daily_kwh": 22.0, "is_weekend": False} for i in range(1, 11)]
    res = project_remaining_month(logs, {}, baseline_monthly_kwh=300.0, total_days_in_month=30)
    assert res["days_logged"] == 10
    assert res["days_remaining"] == 20
    assert res["units_so_far"] == 220.0
    assert res["pace_status"] == "OVER_BUDGET_WARNING"
    assert res["pace_percentage"] > 120.0

def test_adaptive_forecaster_energy_saver():
    """Testing that low daily usage triggers SAVING_ENERGY."""
    logs = [{"day": i, "daily_kwh": 5.0, "is_weekend": False} for i in range(1, 12)]
    res = project_remaining_month(logs, {}, baseline_monthly_kwh=350.0, total_days_in_month=30)
    assert res["pace_status"] == "SAVING_ENERGY"
    assert res["pace_percentage"] < 80.0
