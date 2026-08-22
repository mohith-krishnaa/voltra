"""
Smart Electricity Bill Predictor - Prediction Routes (v2.0)
Handles 22+ home appliances, TGSPDCL official slabs, category analytics & What-If simulator.
"""

import os
import sys
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException

from backend.tariff import calculate_bill_from_units, get_available_tariffs
from backend.recommendations import generate_actionable_tips
from backend.utils.validation import sanitize_household_input, sanitize_appliances_input
from data.generate_dataset import APPLIANCE_SPECS, calculate_physics_units

router = APIRouter(prefix="/api", tags=["prediction"])

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "..", "model", "bill_model.joblib")
_cached_model = None

def get_model():
    """Lazy loader for trained Scikit-learn Pipeline."""
    global _cached_model
    if _cached_model is None:
        if os.path.exists(MODEL_PATH):
            try:
                _cached_model = joblib.load(MODEL_PATH)
            except Exception as e:
                print(f"[Model] Warning loading model: {e}")
                _cached_model = None
    return _cached_model

# --- Pydantic Schemas ---
class ApplianceUsage(BaseModel):
    count: int = Field(default=0, ge=0, le=25)
    hours: float = Field(default=0.0, ge=0.0, le=24.0)

class HouseholdInput(BaseModel):
    house_type: str = "Apartment-2BHK"
    area_sqft: float = 1150.0
    occupants: int = 3
    season: str = "Summer"
    tariff_zone: str = "TGSPDCL-Telangana"
    enable_gruha_jyothi: bool = False
    appliances: Dict[str, ApplianceUsage]

class WhatIfRequest(BaseModel):
    household: HouseholdInput
    modified_appliances: Dict[str, ApplianceUsage]


# ==============================================================================
# DUTY-CYCLE & RUNNING WATTAGE ASSUMPTION:
# Real-world appliances do not pull full nameplate/rated power 100% of the time.
# Inverter compressors (AC/refrigerator) cycle down to baseline maintenance (~35%-55%),
# heating elements (geysers/irons) cut off via thermostat, and electronics (laptops/chargers)
# draw dynamic average power. We compute: effective_kw = base_kw * spec.get("duty_cycle", 1.0).
# DO NOT REMOVE THIS DUTY-CYCLE CONVERSION as it prevents 2-3x bill inflation.
# ==============================================================================
def calculate_detailed_breakdown(household: dict, appliances: dict, total_units: float, effective_rate: float) -> tuple[List[Dict[str, Any]], Dict[str, float], float]:
    """
    Computes per-appliance monthly kWh, category groups, and phantom standby draw.
    Uses physics-grounded effective_kw (base_kw * duty_cycle) with seasonal adjustments.
    """
    season = household.get("season", "Summer")
    
    ac_mult = {"Summer": 1.35, "Monsoon": 1.0, "Winter": 0.30, "Spring": 0.75}.get(season, 1.0)
    cooler_mult = {"Summer": 1.40, "Monsoon": 0.6, "Winter": 0.10, "Spring": 0.80}.get(season, 1.0)
    geyser_mult = {"Summer": 0.25, "Monsoon": 0.9, "Winter": 1.65, "Spring": 0.70}.get(season, 1.0)
    fridge_mult = {"Summer": 1.20, "Monsoon": 1.0, "Winter": 0.85, "Spring": 0.95}.get(season, 1.0)
    fan_mult = {"Summer": 1.25, "Monsoon": 1.0, "Winter": 0.45, "Spring": 0.85}.get(season, 1.0)

    raw_shares = {}
    total_phantom_watts = 0.0

    for app_key, spec in APPLIANCE_SPECS.items():
        app_data = appliances.get(app_key, {"count": 0, "hours": 0.0})
        count = float(app_data.get("count", 0))
        hours = float(app_data.get("hours", 0.0))

        if count > 0:
            total_phantom_watts += count * (spec.get("standby_kw", 0.0) * 1000.0)

        if count <= 0 or hours <= 0:
            raw_shares[app_key] = 0.0
            continue

        base_kw = spec["base_kw"]
        duty_cycle = spec.get("duty_cycle", 1.0)
        effective_kw = base_kw * duty_cycle

        if app_key == "ac":
            raw_shares[app_key] = count * (hours * ac_mult) * effective_kw * 30
        elif app_key == "air_cooler":
            raw_shares[app_key] = count * (hours * cooler_mult) * effective_kw * 30
        elif app_key in ["water_heater", "immersion_rod"]:
            raw_shares[app_key] = count * (hours * geyser_mult) * effective_kw * 30
        elif app_key == "fridge":
            raw_shares[app_key] = count * (hours * fridge_mult) * effective_kw * 30
        elif app_key == "fan":
            raw_shares[app_key] = count * (hours * fan_mult) * effective_kw * 30
        else:
            raw_shares[app_key] = count * hours * effective_kw * 30

    # Standby base
    area = float(household.get("area_sqft", 1150.0))
    occupants = float(household.get("occupants", 3))
    raw_shares["standby"] = 8.0 + (area / 200.0) * 0.5 + (occupants * 1.0)

    raw_sum = sum(raw_shares.values())
    if raw_sum <= 0:
        raw_sum = 1.0

    breakdown = []
    category_totals = {"Climate": 0.0, "Kitchen": 0.0, "Electronics": 0.0, "Cleaning": 0.0, "Lighting": 0.0, "Standby": 0.0}

    for k, raw_val in raw_shares.items():
        proportion = raw_val / raw_sum
        app_units = round(total_units * proportion, 1)
        percentage = round(proportion * 100.0, 1)
        estimated_cost = round(app_units * effective_rate, 2)
        co2_kg = round(app_units * 0.82, 1)

        spec = APPLIANCE_SPECS.get(k, {"category": "Standby", "display": "Standby & Base Load", "default_watt": "25W"})
        category = spec.get("category", "Standby")
        category_totals[category] = round(category_totals.get(category, 0.0) + app_units, 1)

        app_info = appliances.get(k, {})
        breakdown.append({
            "appliance": k,
            "display_name": spec.get("display", k.replace('_', ' ').capitalize()),
            "category": category,
            "default_watt": spec.get("default_watt", ""),
            "monthly_kwh": app_units,
            "percentage": percentage,
            "estimated_cost": estimated_cost,
            "co2_kg": co2_kg,
            "count": app_info.get("count", 1 if k == "standby" else 0),
            "hours_per_day": app_info.get("hours", 24.0 if k == "standby" else 0.0)
        })

    breakdown.sort(key=lambda x: x["monthly_kwh"], reverse=True)
    return breakdown, category_totals, round(total_phantom_watts, 1)


def run_prediction_pipeline(household_dict: dict, appliances_dict: dict) -> Dict[str, Any]:
    """Core prediction pipeline combining ML/physics with TGSPDCL tariffs."""
    sanitized_hh = sanitize_household_input(household_dict)
    sanitized_apps = sanitize_appliances_input(appliances_dict)

    features = {
        "house_type": sanitized_hh["house_type"],
        "area_sqft": sanitized_hh["area_sqft"],
        "occupants": sanitized_hh["occupants"],
        "season": sanitized_hh["season"],
        "tariff_zone": sanitized_hh["tariff_zone"],
    }
    for app_key in APPLIANCE_SPECS.keys():
        app_data = sanitized_apps.get(app_key, {"count": 0, "hours": 0.0})
        features[f"{app_key}_count"] = app_data["count"]
        features[f"{app_key}_hours"] = app_data["hours"]

    # Direct physics calculation guarantees 100% realistic appliance-by-appliance additivity
    physics_kwh = calculate_physics_units(features)
    predicted_kwh = max(10.0, round(physics_kwh, 1))

    # Calculate TGSPDCL / State Utility Bill
    bill_info = calculate_bill_from_units(
        units=predicted_kwh,
        tariff_zone=sanitized_hh["tariff_zone"],
        enable_gruha_jyothi=sanitized_hh.get("enable_gruha_jyothi", False)
    )
    effective_rate = bill_info["effective_rate_per_kwh"]

    # Calculate detailed per-appliance breakdown & category summaries
    breakdown, category_totals, phantom_watts = calculate_detailed_breakdown(
        sanitized_hh, sanitized_apps, predicted_kwh, effective_rate
    )

    # Actionable tips
    tips = generate_actionable_tips(
        breakdown,
        bill_info["total_bill"],
        predicted_kwh,
        effective_rate,
        bill_info["slab_breakdown"],
        applied_category=bill_info.get("applied_category", "")
    )

    benchmark_map = {
        "Apartment-1BHK": 160.0,
        "Apartment-2BHK": 290.0,
        "Apartment-3BHK": 480.0,
        "Villa-Independent": 750.0
    }
    benchmark_units = benchmark_map.get(sanitized_hh["house_type"], 300.0)
    comparison_pct = round(((predicted_kwh - benchmark_units) / benchmark_units) * 100.0, 1)

    return {
        "household": sanitized_hh,
        "appliances": sanitized_apps,
        "predicted_units": predicted_kwh,
        "bill": bill_info,
        "appliance_breakdown": breakdown,
        "category_totals": category_totals,
        "phantom_load": {
            "idle_watts": phantom_watts,
            "monthly_wasted_kwh": round((phantom_watts * 24 * 30) / 1000.0, 1),
            "monthly_wasted_cost": round(((phantom_watts * 24 * 30) / 1000.0) * max(4.5, effective_rate), 2)
        },
        "actionable_tips": tips,
        "benchmark": {
            "average_units_similar_home": benchmark_units,
            "difference_percentage": comparison_pct,
            "status": "higher" if comparison_pct > 5 else ("lower" if comparison_pct < -5 else "average")
        },
        "carbon_footprint": {
            "total_co2_kg": round(predicted_kwh * 0.82, 1),
            "equivalent_trees": max(1, round((predicted_kwh * 0.82) / 21.0))
        }
    }


@router.post("/predict/monthly")
def predict_monthly(payload: HouseholdInput):
    """Predicts monthly units (kWh) and official tariff bill with 22+ appliance analytics."""
    appliances_dict = {k: v.model_dump() for k, v in payload.appliances.items()}
    household_dict = payload.model_dump(exclude={"appliances"})
    return run_prediction_pipeline(household_dict, appliances_dict)


@router.post("/predict/what-if")
def simulate_what_if(payload: WhatIfRequest):
    """Simulates the real-time bill and unit difference when appliance usage is modified."""
    base_apps = {k: v.model_dump() for k, v in payload.household.appliances.items()}
    base_hh = payload.household.model_dump(exclude={"appliances"})
    baseline_result = run_prediction_pipeline(base_hh, base_apps)

    sim_apps = {k: v.model_dump() for k, v in payload.modified_appliances.items()}
    sim_result = run_prediction_pipeline(base_hh, sim_apps)

    unit_delta = round(sim_result["predicted_units"] - baseline_result["predicted_units"], 1)
    bill_delta = round(sim_result["bill"]["total_bill"] - baseline_result["bill"]["total_bill"], 2)
    co2_delta = round(sim_result["carbon_footprint"]["total_co2_kg"] - baseline_result["carbon_footprint"]["total_co2_kg"], 1)

    monthly_savings = max(0.0, -bill_delta)
    annual_savings = round(monthly_savings * 12, 2)

    return {
        "baseline": {
            "units": baseline_result["predicted_units"],
            "total_bill": baseline_result["bill"]["total_bill"]
        },
        "simulated": {
            "units": sim_result["predicted_units"],
            "total_bill": sim_result["bill"]["total_bill"]
        },
        "delta": {
            "units_kwh": unit_delta,
            "bill_amount": bill_delta,
            "co2_kg": co2_delta,
            "percentage_change": round((bill_delta / baseline_result["bill"]["total_bill"]) * 100, 1) if baseline_result["bill"]["total_bill"] > 0 else 0.0
        },
        "savings_impact": {
            "monthly_savings_inr": monthly_savings,
            "annual_savings_inr": annual_savings,
            "is_saving": bill_delta < 0
        },
        "simulated_breakdown": sim_result["appliance_breakdown"],
        "simulated_slabs": sim_result["bill"]["slab_breakdown"]
    }


class SolarRoiRequest(BaseModel):
    monthly_units: float = Field(default=280.0, ge=10.0, le=5000.0)
    monthly_bill: float = Field(default=1600.0, ge=0.0)
    tariff_zone: str = "TGSPDCL-Telangana"
    roof_area_sqft: float = Field(default=400.0, ge=50.0, le=10000.0)
    system_kw: Optional[float] = None


@router.post("/solar/roi")
def calculate_solar_roi(payload: SolarRoiRequest):
    """
    Computes Solar Rooftop ROI, Net Metering simulation, and PM Surya Ghar Muft Bijli Yojana subsidy.
    - 1 kW solar rooftop produces ~120 kWh/month in India.
    - Requires ~100 sq.ft shade-free roof area per 1 kW.
    - Central Subsidy (PM Surya Ghar):
        * 1 kW: ₹30,000
        * 2 kW: ₹60,000
        * 3 kW and above: ₹78,000 (capped)
    - System Benchmark Cost: ~₹60,000 per kW.
    """
    monthly_units = float(payload.monthly_units)
    monthly_bill = float(payload.monthly_bill)
    roof_area = float(payload.roof_area_sqft)

    # Max capacity allowed by roof area (100 sqft / kW)
    max_kw_by_roof = max(1.0, round(roof_area / 100.0, 1))

    # Suggested system capacity to offset ~90% of consumption (120 units/mo per kW)
    ideal_kw = max(1.0, min(10.0, round(monthly_units / 120.0, 1)))

    system_kw = float(payload.system_kw) if payload.system_kw else min(ideal_kw, max_kw_by_roof)
    system_kw = max(1.0, min(15.0, round(system_kw, 1)))

    # Monthly Solar Generation
    solar_gen_units = round(system_kw * 120.0, 1)

    # Net Grid Interaction
    net_units = max(0.0, round(monthly_units - solar_gen_units, 1))
    exported_units = max(0.0, round(solar_gen_units - monthly_units, 1))

    # Recalculate utility bill on net grid import
    from backend.tariff import calculate_bill_from_units
    net_bill_calc = calculate_bill_from_units(net_units, payload.tariff_zone, enable_gruha_jyothi=False)
    net_bill = net_bill_calc["total_bill"]

    # Export credit (approx ₹2.5/unit for excess exported power in most state discoms)
    export_credit = round(exported_units * 2.50, 2)
    final_post_solar_bill = max(0.0, round(net_bill - export_credit, 2))

    monthly_savings = max(0.0, round(monthly_bill - final_post_solar_bill, 2))
    annual_savings = round(monthly_savings * 12.0, 2)

    # Capital Expenditure (Gross Cost)
    gross_cost = round(system_kw * 60000.0, 2)

    # PM Surya Ghar Central Subsidy
    if system_kw < 1.5:
        subsidy = 30000.0
    elif system_kw < 2.5:
        subsidy = 60000.0
    else:
        subsidy = 78000.0
    
    subsidy = min(subsidy, gross_cost * 0.6)
    net_cost = round(max(0.0, gross_cost - subsidy), 2)

    # Payback Period (years)
    payback_years = round(net_cost / annual_savings, 1) if annual_savings > 0 else 0.0

    # 25-Year Lifetime Savings (accounting for 0.7% degradation)
    lifetime_savings = round(annual_savings * 22.0 - net_cost, 2)
    lifetime_co2_tonnes = round((solar_gen_units * 12 * 25 * 0.82) / 1000.0, 1)

    return {
        "system_specs": {
            "system_kw": system_kw,
            "recommended_kw": ideal_kw,
            "roof_area_required_sqft": round(system_kw * 100.0, 0),
            "monthly_solar_generation_kwh": solar_gen_units
        },
        "financials": {
            "gross_investment": gross_cost,
            "pm_surya_ghar_subsidy": subsidy,
            "net_customer_cost": net_cost,
            "monthly_savings": monthly_savings,
            "annual_savings": annual_savings,
            "payback_years": payback_years,
            "lifetime_25yr_net_savings": max(0.0, lifetime_savings)
        },
        "net_metering": {
            "pre_solar_units": monthly_units,
            "pre_solar_bill": monthly_bill,
            "post_solar_net_units": net_units,
            "post_solar_bill": final_post_solar_bill,
            "exported_units": exported_units,
            "export_credit": export_credit
        },
        "environmental": {
            "annual_co2_offset_kg": round(solar_gen_units * 12 * 0.82, 1),
            "lifetime_co2_offset_tonnes": lifetime_co2_tonnes,
            "equivalent_trees_planted": round(lifetime_co2_tonnes * 45)
        }
    }


@router.get("/tariffs/zones")
def get_tariffs():
    """Returns available electricity board tariff zones."""
    return get_available_tariffs()


@router.get("/appliances/specs")
def get_appliance_specs():
    """Returns the single source of truth for all 22+ appliance specifications."""
    specs_list = []
    for key, spec in APPLIANCE_SPECS.items():
        specs_list.append({
            "key": key,
            "display": spec.get("display", key.replace('_', ' ').title()),
            "desc": spec.get("desc", ""),
            "category": spec.get("category", "Other"),
            "base_kw": spec.get("base_kw", 0.1),
            "duty_cycle": spec.get("duty_cycle", 1.0),
            "effective_watts": round(spec.get("base_kw", 0.1) * spec.get("duty_cycle", 1.0) * 1000.0),
            "default_watt": spec.get("default_watt", ""),
            "max_hours": spec.get("max_hours", 24.0),
            "standby_kw": spec.get("standby_kw", 0.0)
        })
    return specs_list


@router.get("/demo/presets")
def get_demo_presets():
    """Returns curated presets (Small household, Family + AC, Heavy usage) and judge demos."""
    return [
        {
            "id": "preset_small_household",
            "name": "🌱 Small Household (1BHK / Eco)",
            "description": "Minimalist living without AC. Energy-efficient fans, LED lighting, fridge, TV, Wi-Fi router. Low slab rate.",
            "household": {
                "house_type": "Apartment-1BHK",
                "area_sqft": 600,
                "occupants": 2,
                "season": "Summer",
                "tariff_zone": "TGSPDCL-Telangana",
                "enable_gruha_jyothi": True
            },
            "appliances": {
                "ac": {"count": 0, "hours": 0},
                "air_cooler": {"count": 1, "hours": 4.0},
                "fridge": {"count": 1, "hours": 24.0},
                "fan": {"count": 2, "hours": 8.0},
                "light": {"count": 4, "hours": 5.0},
                "water_heater": {"count": 0, "hours": 0},
                "rice_cooker": {"count": 1, "hours": 0.5},
                "mixer_grinder": {"count": 1, "hours": 0.1},
                "induction_cooktop": {"count": 0, "hours": 0},
                "microwave": {"count": 0, "hours": 0},
                "water_purifier": {"count": 1, "hours": 1.0},
                "mobile_chargers": {"count": 2, "hours": 2.0},
                "laptop_computer": {"count": 1, "hours": 4.0},
                "tv_home_theater": {"count": 1, "hours": 3.0},
                "wifi_router": {"count": 1, "hours": 24.0},
                "iron_box": {"count": 1, "hours": 0.1},
                "washing_machine": {"count": 1, "hours": 0.5},
                "ev_charger": {"count": 0, "hours": 0},
                "immersion_rod": {"count": 0, "hours": 0}, "air_purifier": {"count": 0, "hours": 0},
                "wet_grinder": {"count": 0, "hours": 0}, "electric_kettle": {"count": 0, "hours": 0}, "dishwasher": {"count": 0, "hours": 0},
                "earbuds_chargers": {"count": 0, "hours": 0}, "smart_speakers": {"count": 0, "hours": 0}, "gaming_console": {"count": 0, "hours": 0},
                "vacuum_cleaner": {"count": 0, "hours": 0}, "hair_dryer": {"count": 0, "hours": 0}
            }
        },
        {
            "id": "preset_family_ac",
            "name": "👨‍👩‍👧‍👦 Family + AC (Standard 2BHK)",
            "description": "Standard 4-person family with 1 AC (nightly 4h), geyser, fridge, washing machine, and kitchen appliances.",
            "household": {
                "house_type": "Apartment-2BHK",
                "area_sqft": 1150,
                "occupants": 4,
                "season": "Summer",
                "tariff_zone": "TGSPDCL-Telangana",
                "enable_gruha_jyothi": False
            },
            "appliances": {
                "ac": {"count": 1, "hours": 4.0},
                "air_cooler": {"count": 0, "hours": 0},
                "fridge": {"count": 1, "hours": 24.0},
                "fan": {"count": 3, "hours": 8.0},
                "light": {"count": 6, "hours": 5.0},
                "water_heater": {"count": 1, "hours": 0.3},
                "rice_cooker": {"count": 1, "hours": 0.5},
                "mixer_grinder": {"count": 1, "hours": 0.15},
                "induction_cooktop": {"count": 0, "hours": 0},
                "microwave": {"count": 1, "hours": 0.1},
                "water_purifier": {"count": 1, "hours": 1.5},
                "mobile_chargers": {"count": 3, "hours": 2.5},
                "laptop_computer": {"count": 1, "hours": 6.0},
                "tv_home_theater": {"count": 1, "hours": 4.0},
                "wifi_router": {"count": 1, "hours": 24.0},
                "iron_box": {"count": 1, "hours": 0.2},
                "washing_machine": {"count": 1, "hours": 0.6},
                "ev_charger": {"count": 0, "hours": 0},
                "immersion_rod": {"count": 0, "hours": 0}, "air_purifier": {"count": 0, "hours": 0},
                "wet_grinder": {"count": 0, "hours": 0}, "electric_kettle": {"count": 0, "hours": 0}, "dishwasher": {"count": 0, "hours": 0},
                "earbuds_chargers": {"count": 0, "hours": 0}, "smart_speakers": {"count": 0, "hours": 0}, "gaming_console": {"count": 0, "hours": 0},
                "vacuum_cleaner": {"count": 0, "hours": 0}, "hair_dryer": {"count": 0, "hours": 0}
            }
        },
        {
            "id": "preset_heavy_usage",
            "name": "⚡ Heavy Usage (3BHK / Villa / EV)",
            "description": "High power consumption with multiple ACs, EV charging, gaming workstation, dishwasher, and microwave.",
            "household": {
                "house_type": "Apartment-3BHK",
                "area_sqft": 1850,
                "occupants": 5,
                "season": "Summer",
                "tariff_zone": "TGSPDCL-Telangana",
                "enable_gruha_jyothi": False
            },
            "appliances": {
                "ac": {"count": 2, "hours": 7.0},
                "air_cooler": {"count": 0, "hours": 0},
                "fridge": {"count": 1, "hours": 24.0},
                "fan": {"count": 5, "hours": 10.0},
                "light": {"count": 12, "hours": 6.0},
                "water_heater": {"count": 2, "hours": 0.5},
                "rice_cooker": {"count": 1, "hours": 0.8},
                "mixer_grinder": {"count": 1, "hours": 0.2},
                "induction_cooktop": {"count": 1, "hours": 1.0},
                "microwave": {"count": 1, "hours": 0.3},
                "electric_kettle": {"count": 1, "hours": 0.2},
                "water_purifier": {"count": 1, "hours": 2.0},
                "dishwasher": {"count": 1, "hours": 1.0},
                "mobile_chargers": {"count": 4, "hours": 3.0},
                "earbuds_chargers": {"count": 2, "hours": 2.0},
                "laptop_computer": {"count": 2, "hours": 8.0},
                "smart_speakers": {"count": 1, "hours": 6.0},
                "tv_home_theater": {"count": 1, "hours": 5.0},
                "gaming_console": {"count": 1, "hours": 3.0},
                "wifi_router": {"count": 1, "hours": 24.0},
                "iron_box": {"count": 1, "hours": 0.4},
                "washing_machine": {"count": 1, "hours": 1.0},
                "vacuum_cleaner": {"count": 1, "hours": 0.3},
                "hair_dryer": {"count": 1, "hours": 0.2},
                "ev_charger": {"count": 1, "hours": 2.0},
                "immersion_rod": {"count": 0, "hours": 0}, "air_purifier": {"count": 1, "hours": 6.0},
                "wet_grinder": {"count": 0, "hours": 0}
            }
        },
        {
            "id": "tgspdcl_summer_2bhk_family",
            "name": "TGSPDCL 2BHK Family (Summer AC + Kitchen)",
            "description": "Typical 4-member Hyderabad household with 1 AC (4h), fridge, fans, kitchen appliances, and TGSPDCL official LT-1 tariff.",
            "household": {
                "house_type": "Apartment-2BHK",
                "area_sqft": 1150,
                "occupants": 4,
                "season": "Summer",
                "tariff_zone": "TGSPDCL-Telangana",
                "enable_gruha_jyothi": False
            },
            "appliances": {
                "induction_cooktop": {"count": 1, "hours": 1.0},
                "microwave": {"count": 1, "hours": 0.3},
                "electric_kettle": {"count": 1, "hours": 0.2},
                "water_purifier": {"count": 1, "hours": 2.5},
                "mobile_chargers": {"count": 4, "hours": 4.0},
                "earbuds_chargers": {"count": 2, "hours": 2.0},
                "laptop_computer": {"count": 2, "hours": 8.0},
                "smart_speakers": {"count": 1, "hours": 6.0},
                "tv_home_theater": {"count": 1, "hours": 5.0},
                "wifi_router": {"count": 1, "hours": 24.0},
                "iron_box": {"count": 1, "hours": 0.5},
                "washing_machine": {"count": 1, "hours": 1.0},
                "hair_dryer": {"count": 1, "hours": 0.2},
                "light": {"count": 10, "hours": 6.0}
            }
        },
        {
            "id": "gruha_jyothi_1bhk",
            "name": "🌱 1BHK Eco (Under 200 Units - Gruha Jyothi Free)",
            "description": "Telangana household under 200 units with 100% Gruha Jyothi ₹0 bill subsidy.",
            "household": {
                "house_type": "Apartment-1BHK",
                "area_sqft": 550,
                "occupants": 2,
                "season": "Spring",
                "tariff_zone": "TGSPDCL-Telangana",
                "enable_gruha_jyothi": True
            },
            "appliances": {
                "ac": {"count": 0, "hours": 0.0},
                "air_cooler": {"count": 1, "hours": 5.0},
                "fan": {"count": 2, "hours": 8.0},
                "water_heater": {"count": 0, "hours": 0.0},
                "fridge": {"count": 1, "hours": 24.0},
                "rice_cooker": {"count": 1, "hours": 0.8},
                "mixer_grinder": {"count": 1, "hours": 0.2},
                "water_purifier": {"count": 1, "hours": 1.5},
                "mobile_chargers": {"count": 2, "hours": 3.0},
                "laptop_computer": {"count": 1, "hours": 5.0},
                "tv_home_theater": {"count": 1, "hours": 3.0},
                "wifi_router": {"count": 1, "hours": 24.0},
                "iron_box": {"count": 1, "hours": 0.3},
                "washing_machine": {"count": 1, "hours": 0.5},
                "light": {"count": 5, "hours": 4.0}
            }
        },
        {
            "id": "wfh_techie_3bhk",
            "name": "💻 3BHK IT Techie (Dual AC, Servers & Gaming)",
            "description": "High tech household with PS5, 3 Laptops, Soundbar, Smart Home, RO Purifier, Air Purifier & Dual ACs.",
            "household": {
                "house_type": "Apartment-3BHK",
                "area_sqft": 1800,
                "occupants": 3,
                "season": "Summer",
                "tariff_zone": "BESCOM-City",
                "enable_gruha_jyothi": False
            },
            "appliances": {
                "ac": {"count": 2, "hours": 10.0},
                "fan": {"count": 5, "hours": 14.0},
                "air_purifier": {"count": 2, "hours": 12.0},
                "water_heater": {"count": 2, "hours": 1.0},
                "fridge": {"count": 1, "hours": 24.0},
                "induction_cooktop": {"count": 1, "hours": 1.5},
                "microwave": {"count": 1, "hours": 0.8},
                "dishwasher": {"count": 1, "hours": 1.0},
                "water_purifier": {"count": 1, "hours": 3.0},
                "mobile_chargers": {"count": 5, "hours": 5.0},
                "earbuds_chargers": {"count": 3, "hours": 3.0},
                "laptop_computer": {"count": 3, "hours": 12.0},
                "smart_speakers": {"count": 3, "hours": 10.0},
                "tv_home_theater": {"count": 2, "hours": 6.0},
                "gaming_console": {"count": 1, "hours": 3.5},
                "wifi_router": {"count": 1, "hours": 24.0},
                "vacuum_cleaner": {"count": 1, "hours": 0.5},
                "washing_machine": {"count": 1, "hours": 1.5},
                "light": {"count": 14, "hours": 7.0}
            }
        },
        {
            "id": "villa_ev_luxury",
            "name": "⚡ Independent Villa with EV & Heavy Load",
            "description": "Large villa with 4 ACs, Daily Level-2 EV Charging, Stone Wet Grinder, Dishwasher, Robot Vacuum.",
            "household": {
                "house_type": "Villa-Independent",
                "area_sqft": 3400,
                "occupants": 6,
                "season": "Summer",
                "tariff_zone": "TGSPDCL-Telangana",
                "enable_gruha_jyothi": False
            },
            "appliances": {
                "ac": {"count": 4, "hours": 6.0},
                "air_cooler": {"count": 1, "hours": 4.0},
                "fan": {"count": 8, "hours": 12.0},
                "water_heater": {"count": 3, "hours": 1.5},
                "fridge": {"count": 2, "hours": 24.0},
                "rice_cooker": {"count": 1, "hours": 1.5},
                "mixer_grinder": {"count": 1, "hours": 0.6},
                "wet_grinder": {"count": 1, "hours": 1.0},
                "induction_cooktop": {"count": 1, "hours": 2.0},
                "microwave": {"count": 1, "hours": 0.8},
                "dishwasher": {"count": 1, "hours": 1.5},
                "water_purifier": {"count": 1, "hours": 4.0},
                "ev_charger": {"count": 1, "hours": 4.0},
                "mobile_chargers": {"count": 6, "hours": 5.0},
                "laptop_computer": {"count": 4, "hours": 8.0},
                "tv_home_theater": {"count": 3, "hours": 6.0},
                "wifi_router": {"count": 1, "hours": 24.0},
                "iron_box": {"count": 1, "hours": 1.0},
                "washing_machine": {"count": 1, "hours": 2.0},
                "vacuum_cleaner": {"count": 1, "hours": 0.8},
                "light": {"count": 22, "hours": 8.0}
            }
        }
    ]
