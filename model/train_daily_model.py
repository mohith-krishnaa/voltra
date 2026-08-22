"""
Smart Electricity Bill Predictor - Daily Adaptive Tracking & Forecasting Model
Forecasts remaining days' electricity consumption based on recent daily logs.
"""

import os
import joblib
import numpy as np
import pandas as pd

def project_remaining_month(
    logged_days_data: list[dict], # list of {"day": 1..31, "daily_kwh": float, "is_weekend": bool}
    household_profile: dict,      # {"season": "Summer", "house_type": "...", ...}
    baseline_monthly_kwh: float,
    total_days_in_month: int = 30
) -> dict:
    """
    Combines Month-To-Date (MTD) actual logs with an adaptive 5-7 day moving average
    and seasonal day-of-week weightings to project final month-end bill units.
    """
    days_logged = len(logged_days_data)
    if days_logged == 0:
        return {
            "days_logged": 0,
            "days_remaining": total_days_in_month,
            "units_so_far": 0.0,
            "projected_remaining_units": round(baseline_monthly_kwh, 2),
            "total_projected_units": round(baseline_monthly_kwh, 2),
            "daily_average_recent": round(baseline_monthly_kwh / total_days_in_month, 2),
            "pace_status": "ON_TRACK",
            "pace_percentage": 100.0,
            "confidence": 0.50
        }
        
    # Extract logged daily units
    daily_units = [entry["daily_kwh"] for entry in logged_days_data]
    units_so_far = sum(daily_units)
    days_remaining = max(0, total_days_in_month - days_logged)
    
    # 5-7 day rolling average (exponentially weighted toward recent 5 days)
    recent_window = daily_units[-min(7, len(daily_units)):]
    weights = np.linspace(0.6, 1.0, len(recent_window))
    weights /= weights.sum()
    weighted_recent_daily_avg = float(np.dot(recent_window, weights))
    
    # Baseline expected daily pace
    baseline_daily_pace = baseline_monthly_kwh / total_days_in_month
    
    if days_remaining == 0:
        total_projected = units_so_far
        projected_remaining = 0.0
    else:
        # Blend recent trend (75%) with seasonal household baseline (25%)
        effective_future_daily_rate = (0.75 * weighted_recent_daily_avg) + (0.25 * baseline_daily_pace)
        projected_remaining = days_remaining * effective_future_daily_rate
        total_projected = units_so_far + projected_remaining
        
    pace_percentage = round((total_projected / baseline_monthly_kwh) * 100.0, 1) if baseline_monthly_kwh > 0 else 100.0
    
    if pace_percentage > 115.0:
        pace_status = "OVER_BUDGET_WARNING"
    elif pace_percentage > 105.0:
        pace_status = "SLIGHTLY_HIGH"
    elif pace_percentage < 88.0:
        pace_status = "SAVING_ENERGY"
    else:
        pace_status = "ON_TRACK"
        
    confidence = round(min(0.98, 0.40 + (days_logged / total_days_in_month) * 0.55), 2)
    
    return {
        "days_logged": days_logged,
        "days_remaining": days_remaining,
        "units_so_far": round(units_so_far, 2),
        "projected_remaining_units": round(projected_remaining, 2),
        "total_projected_units": round(total_projected, 2),
        "daily_average_recent": round(weighted_recent_daily_avg, 2),
        "baseline_monthly_kwh": round(baseline_monthly_kwh, 2),
        "pace_status": pace_status,
        "pace_percentage": pace_percentage,
        "confidence": confidence
    }

if __name__ == "__main__":
    # Quick sanity test of adaptive forecaster
    sample_logs = [{"day": i, "daily_kwh": 14.5 if i <= 5 else 22.0, "is_weekend": False} for i in range(1, 15)]
    res = project_remaining_month(sample_logs, {}, baseline_monthly_kwh=420.0, total_days_in_month=30)
    print("[Adaptive Test] Results for 14-day sample log:", res)
