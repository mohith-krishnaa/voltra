"""
Unit Tests for Authentication and Payment/Solar Endpoints
"""

from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

def test_user_registration_and_login():
    test_email = f"testuser_{int(__import__('time').time())}@example.com"
    reg_payload = {
        "email": test_email,
        "password": "securepassword123",
        "full_name": "Test Consumer"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 200, res.text
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_email
    assert data["user"]["full_name"] == "Test Consumer"

    # Test login with the same credentials
    login_payload = {
        "email": test_email,
        "password": "securepassword123"
    }
    login_res = client.post("/api/auth/login", json=login_payload)
    assert login_res.status_code == 200, login_res.text
    login_data = login_res.json()
    assert "access_token" in login_data

def test_google_auth_and_forgot_password():
    # 1. Test Google SSO
    google_payload = {
        "email": f"googletest_{int(__import__('time').time())}@gmail.com",
        "full_name": "Google Consumer",
        "google_id": "google_test_oauth_9812"
    }
    g_res = client.post("/api/auth/google", json=google_payload)
    assert g_res.status_code == 200, g_res.text
    g_data = g_res.json()
    assert "access_token" in g_data
    assert g_data["user"]["email"] == google_payload["email"]

    # 2. Test Forgot Password OTP Request
    forgot_res = client.post("/api/auth/forgot-password", json={"email": google_payload["email"]})
    assert forgot_res.status_code == 200, forgot_res.text
    forgot_data = forgot_res.json()
    assert forgot_data["status"] == "SENT"
    otp = forgot_data.get("demo_otp")
    assert otp is not None

    # 3. Test Reset Password with OTP
    reset_res = client.post("/api/auth/reset-password", json={
        "email": google_payload["email"],
        "otp": otp,
        "new_password": "newsecurepassword456"
    })
    assert reset_res.status_code == 200, reset_res.text
    reset_data = reset_res.json()
    assert reset_data["status"] == "SUCCESS"
    assert "access_token" in reset_data

def test_fetch_consumer_bill():
    res = client.get("/api/payment/fetch-bill?usc_number=1029384729&discom=TGSPDCL-Telangana")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "VALID"
    assert "consumer_name" in data
    assert "units_consumed" in data
    assert data["total_amount_payable"] > 0

def test_create_order_and_verify_payment():
    create_payload = {
        "usc_number": "1029384729",
        "consumer_name": "K. V. Rajesh Kumar",
        "discom": "TGSPDCL-Telangana",
        "billing_month": "August 2026",
        "units_kwh": 324.3,
        "amount_inr": 2108.16,
        "promo_code": "PROMPT15",
        "payment_method": "UPI"
    }
    order_res = client.post("/api/payment/create-order", json=create_payload)
    assert order_res.status_code == 200
    order_data = order_res.json()
    assert order_data["status"] == "CREATED"
    assert "order_id" in order_data
    assert "upi_intent_url" in order_data

    verify_payload = {
        "order_id": order_data["order_id"],
        "payment_id": "PAY_TEST_123",
        "usc_number": "1029384729",
        "consumer_name": "K. V. Rajesh Kumar",
        "discom": "TGSPDCL-Telangana",
        "billing_month": "August 2026",
        "units_kwh": 324.3,
        "amount_inr": 2108.16,
        "discount_inr": order_data["discount_applied"],
        "net_paid_inr": order_data["net_payable"],
        "payment_method": "UPI (GPAY)",
        "promo_code": "PROMPT15"
    }
    verify_res = client.post("/api/payment/verify", json=verify_payload)
    assert verify_res.status_code == 200
    verify_data = verify_res.json()
    assert verify_data["status"] == "SUCCESS"
    assert "receipt" in verify_data
    assert verify_data["receipt"]["status"] == "CLEARED_AND_SETTLED"

def test_solar_roi_calculator():
    solar_payload = {
        "monthly_units": 350.0,
        "roof_area_sqft": 500.0,
        "tariff_zone": "TGSPDCL-Telangana",
        "current_monthly_bill": 2400.0
    }
    res = client.post("/api/solar/calculate-roi", json=solar_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["recommended_system_kw"] > 0
    assert data["pm_surya_ghar_subsidy_inr"] > 0
    assert data["annual_savings_inr"] > 0
    assert data["payback_period_years"] > 0
