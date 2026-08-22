"""
Integration Tests for FastAPI Endpoints
"""

import pytest
from fastapi.testclient import TestClient
from backend.app import app
from backend.database import init_db

@pytest.fixture(autouse=True)
def setup_database():
    init_db()

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_tariffs_endpoint():
    response = client.get("/api/tariffs/zones")
    assert response.status_code == 200
    assert len(response.json()) >= 4

def test_demo_presets_endpoint():
    response = client.get("/api/demo/presets")
    assert response.status_code == 200
    presets = response.json()
    assert len(presets) >= 3
    assert any("summer" in p["id"] for p in presets)

def test_monthly_prediction():
    payload = {
        "house_type": "Apartment-2BHK",
        "area_sqft": 1100,
        "occupants": 3,
        "season": "Summer",
        "tariff_zone": "Tiered-Standard",
        "appliances": {
            "ac": {"count": 1, "hours": 6.0},
            "fridge": {"count": 1, "hours": 24.0},
            "fan": {"count": 3, "hours": 10.0},
            "light": {"count": 8, "hours": 5.0},
            "geyser": {"count": 1, "hours": 0.5},
            "washing_machine": {"count": 1, "hours": 1.0},
            "tv": {"count": 1, "hours": 4.0},
            "microwave": {"count": 1, "hours": 0.5},
            "ev_charger": {"count": 0, "hours": 0.0},
            "computer": {"count": 1, "hours": 6.0}
        }
    }
    response = client.post("/api/predict/monthly", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_units" in data
    assert data["predicted_units"] > 100
    assert "bill" in data
    assert data["bill"]["total_bill"] > 0
    assert len(data["appliance_breakdown"]) > 0
    assert len(data["actionable_tips"]) > 0

def test_what_if_simulation():
    payload = {
        "household": {
            "house_type": "Apartment-2BHK",
            "area_sqft": 1100,
            "occupants": 3,
            "season": "Summer",
            "tariff_zone": "Tiered-Standard",
            "appliances": {
                "ac": {"count": 1, "hours": 8.0},
                "fridge": {"count": 1, "hours": 24.0},
                "fan": {"count": 3, "hours": 10.0}
            }
        },
        "modified_appliances": {
            "ac": {"count": 1, "hours": 4.0}, # Reduced by 4 hours
            "fridge": {"count": 1, "hours": 24.0},
            "fan": {"count": 3, "hours": 10.0}
        }
    }
    response = client.post("/api/predict/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["savings_impact"]["is_saving"] is True
    assert data["delta"]["units_kwh"] < 0
    assert data["delta"]["bill_amount"] < 0
    assert data["savings_impact"]["monthly_savings_inr"] > 0

def test_daily_logs_and_forecast():
    # 1. Log a daily entry
    log_payload = {
        "household_id": 1,
        "date": "2026-08-15",
        "direct_kwh": 18.5,
        "notes": "Testing AC heatwave"
    }
    response = client.post("/api/daily-logs", json=log_payload)
    assert response.status_code == 200
    
    # 2. Fetch adaptive forecast
    forecast_resp = client.get("/api/forecast/adaptive/1")
    assert forecast_resp.status_code == 200
    forecast_data = forecast_resp.json()
    assert "projected_total_units" in forecast_data
    assert "pace_status" in forecast_data
