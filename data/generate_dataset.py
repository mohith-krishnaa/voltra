"""
Smart Electricity Bill Predictor - Synthetic Training Data Generator (v2.0)
Expanded with 22+ comprehensive home appliances, accurate physics & standby loads (Pure Python).
"""

from __future__ import annotations
import os
import random
import csv
from typing import Dict, Any, List

# Comprehensive Appliance Wattage Specs (base_kw in kW, duty_cycle factor) & realistic baseline properties
APPLIANCE_SPECS: Dict[str, Dict[str, Any]] = {
    # 1. Climate & Cooling
    "ac": {"category": "Climate", "base_kw": 1.5, "duty_cycle": 0.55, "standby_kw": 0.005, "max_hours": 18.0, "display": "Air Conditioner (1.5T)", "desc": "1.5T Inverter AC (Compressor cycles)", "default_watt": "825W avg. running watts"},
    "air_cooler": {"category": "Climate", "base_kw": 0.18, "duty_cycle": 1.0, "standby_kw": 0.0, "max_hours": 16.0, "display": "Air Cooler (Desert/Room)", "desc": "Desert / Room Evaporative Cooler", "default_watt": "180W avg. running watts"},
    "fan": {"category": "Climate", "base_kw": 0.065, "duty_cycle": 1.0, "standby_kw": 0.0, "max_hours": 20.0, "display": "Ceiling / Table Fan", "desc": "Standard Induction Fan", "default_watt": "65W avg. running watts"},
    "water_heater": {"category": "Climate", "base_kw": 2.2, "duty_cycle": 0.65, "standby_kw": 0.002, "max_hours": 4.0, "display": "Water Geyser / Heater", "desc": "Storage Geyser (Thermostat auto-cutoff)", "default_watt": "1430W avg. running watts"},
    "immersion_rod": {"category": "Climate", "base_kw": 1.5, "duty_cycle": 0.85, "standby_kw": 0.0, "max_hours": 2.0, "display": "Water Immersion Rod", "desc": "Direct Water Heating Rod", "default_watt": "1275W avg. running watts"},
    "air_purifier": {"category": "Climate", "base_kw": 0.05, "duty_cycle": 0.80, "standby_kw": 0.002, "max_hours": 24.0, "display": "Room Air Purifier", "desc": "HEPA Filter Air Cleaner", "default_watt": "40W avg. running watts"},

    # 2. Kitchen & Cooking
    "fridge": {"category": "Kitchen", "base_kw": 0.18, "duty_cycle": 0.35, "standby_kw": 0.01, "max_hours": 24.0, "display": "Refrigerator (24x7)", "desc": "Frost-Free Inverter (Compressor cycles)", "default_watt": "65W avg. running watts"},
    "rice_cooker": {"category": "Kitchen", "base_kw": 0.70, "duty_cycle": 0.70, "standby_kw": 0.002, "max_hours": 3.0, "display": "Electric Rice Cooker", "desc": "Automatic Cook & Warm", "default_watt": "490W avg. running watts"},
    "mixer_grinder": {"category": "Kitchen", "base_kw": 0.60, "duty_cycle": 0.80, "standby_kw": 0.0, "max_hours": 2.0, "display": "Mixer Grinder / Blender", "desc": "Kitchen Masala & Chutney Grinder", "default_watt": "480W avg. running watts"},
    "wet_grinder": {"category": "Kitchen", "base_kw": 0.20, "duty_cycle": 0.85, "standby_kw": 0.0, "max_hours": 2.0, "display": "Stone Wet Grinder", "desc": "Idli / Dosa Stone Batter Grinder", "default_watt": "170W avg. running watts"},
    "induction_cooktop": {"category": "Kitchen", "base_kw": 1.8, "duty_cycle": 0.75, "standby_kw": 0.003, "max_hours": 4.0, "display": "Induction Cooktop / Stove", "desc": "Electromagnetic Induction Stove", "default_watt": "1350W avg. running watts"},
    "microwave": {"category": "Kitchen", "base_kw": 1.3, "duty_cycle": 0.70, "standby_kw": 0.003, "max_hours": 2.0, "display": "Microwave Oven", "desc": "Convection & Reheating Oven", "default_watt": "910W avg. running watts"},
    "electric_kettle": {"category": "Kitchen", "base_kw": 1.5, "duty_cycle": 0.90, "standby_kw": 0.0, "max_hours": 1.0, "display": "Electric Water Kettle", "desc": "Rapid Water Boiling Kettle", "default_watt": "1350W avg. running watts"},
    "water_purifier": {"category": "Kitchen", "base_kw": 0.05, "duty_cycle": 0.70, "standby_kw": 0.002, "max_hours": 4.0, "display": "Water Purifier (RO + UV)", "desc": "Multi-Stage RO+UV Purifier", "default_watt": "35W avg. running watts"},
    "dishwasher": {"category": "Kitchen", "base_kw": 1.4, "duty_cycle": 0.60, "standby_kw": 0.002, "max_hours": 2.0, "display": "Automatic Dishwasher", "desc": "Hot Water Wash & Dry Cycle", "default_watt": "840W avg. running watts"},

    # 3. Daily Electronics & Gadgets
    "mobile_chargers": {"category": "Electronics", "base_kw": 0.03, "duty_cycle": 0.50, "standby_kw": 0.002, "max_hours": 8.0, "display": "Mobile Fast Chargers", "desc": "30W–65W Fast Phone Chargers", "default_watt": "15W avg. running watts"},
    "earbuds_chargers": {"category": "Electronics", "base_kw": 0.008, "duty_cycle": 0.50, "standby_kw": 0.001, "max_hours": 6.0, "display": "Earbuds / Watch Charger", "desc": "TWS Earbuds & Smartwatch Dock", "default_watt": "4W avg. running watts"},
    "laptop_computer": {"category": "Electronics", "base_kw": 0.12, "duty_cycle": 0.40, "standby_kw": 0.005, "max_hours": 14.0, "display": "Laptop / Desktop PC", "desc": "Work / Study Computer Station", "default_watt": "50W avg. running watts"},
    "smart_speakers": {"category": "Electronics", "base_kw": 0.025, "duty_cycle": 0.60, "standby_kw": 0.004, "max_hours": 12.0, "display": "Smart Speakers / Soundbar", "desc": "Alexa / Soundbar / Bluetooth", "default_watt": "15W avg. running watts"},
    "tv_home_theater": {"category": "Electronics", "base_kw": 0.12, "duty_cycle": 0.75, "standby_kw": 0.003, "max_hours": 12.0, "display": "Smart TV & Home Theater", "desc": "55\" LED TV + Audio System", "default_watt": "90W avg. running watts"},
    "gaming_console": {"category": "Electronics", "base_kw": 0.22, "duty_cycle": 0.80, "standby_kw": 0.004, "max_hours": 8.0, "display": "Gaming Console (PS5/Xbox)", "desc": "High-Performance Gaming Setup", "default_watt": "175W avg. running watts"},
    "wifi_router": {"category": "Electronics", "base_kw": 0.012, "duty_cycle": 1.0, "standby_kw": 0.012, "max_hours": 24.0, "display": "Wi-Fi Router (24x7)", "desc": "Dual-Band Fiber / Wi-Fi 6 Router", "default_watt": "12W avg. running watts"},

    # 4. Care, Cleaning & EV
    "iron_box": {"category": "Cleaning", "base_kw": 1.2, "duty_cycle": 0.50, "standby_kw": 0.0, "max_hours": 2.0, "display": "Iron Box / Steam Iron", "desc": "Steam / Dry Clothes Iron", "default_watt": "600W avg. running watts"},
    "washing_machine": {"category": "Cleaning", "base_kw": 0.65, "duty_cycle": 0.60, "standby_kw": 0.002, "max_hours": 3.0, "display": "Washing Machine", "desc": "Front / Top Load Automatic Cycle", "default_watt": "390W avg. running watts"},
    "vacuum_cleaner": {"category": "Cleaning", "base_kw": 0.80, "duty_cycle": 0.80, "standby_kw": 0.002, "max_hours": 2.0, "display": "Vacuum / Robot Cleaner", "desc": "Handheld / Robotic Vacuum", "default_watt": "640W avg. running watts"},
    "hair_dryer": {"category": "Cleaning", "base_kw": 1.4, "duty_cycle": 0.85, "standby_kw": 0.0, "max_hours": 1.0, "display": "Hair Dryer / Stylist", "desc": "Hot Air Hair Styling Blower", "default_watt": "1200W avg. running watts"},
    "ev_charger": {"category": "Cleaning", "base_kw": 3.3, "duty_cycle": 0.95, "standby_kw": 0.005, "max_hours": 6.0, "display": "EV 2W/4W Charger", "desc": "Level-2 Home Charging Unit", "default_watt": "3150W avg. running watts"},
    "light": {"category": "Lighting", "base_kw": 0.015, "duty_cycle": 1.0, "standby_kw": 0.0, "max_hours": 12.0, "display": "LED Lighting / Bulbs", "desc": "Energy-Efficient LED Fixtures", "default_watt": "15W avg. running watts"}
}

HOUSE_PROFILES = {
    "Apartment-1BHK": {"area_range": (450, 750), "occ_range": (1, 3), "fan_range": (2, 4), "light_range": (4, 8), "ac_prob": 0.50},
    "Apartment-2BHK": {"area_range": (800, 1300), "occ_range": (2, 5), "fan_range": (3, 6), "light_range": (7, 14), "ac_prob": 0.85},
    "Apartment-3BHK": {"area_range": (1350, 2200), "occ_range": (3, 6), "fan_range": (4, 8), "light_range": (10, 20), "ac_prob": 0.95},
    "Villa-Independent": {"area_range": (2000, 4500), "occ_range": (3, 8), "fan_range": (5, 10), "light_range": (14, 25), "ac_prob": 0.98},
}

SEASONS = ["Summer", "Monsoon", "Winter", "Spring"]
TARIFF_ZONES = ["TGSPDCL-Telangana", "APSPDCL-AP", "Tiered-Standard", "TNEB-Urban", "BESCOM-City", "MSEDCL-Metro", "Green-Slab"]


def calculate_physics_units(row: Dict[str, Any], include_noise: bool = False) -> float:
    """
    Direct thermodynamic calculation using running wattage (effective_kw = base_kw * duty_cycle)
    and seasonal factors to compute monthly electricity consumption in kWh (units).
    """
    season = row.get("season", "Summer")
    
    # Climate seasonal multipliers
    ac_mult = {"Summer": 1.35, "Monsoon": 1.0, "Winter": 0.30, "Spring": 0.75}.get(season, 1.0)
    cooler_mult = {"Summer": 1.40, "Monsoon": 0.6, "Winter": 0.10, "Spring": 0.80}.get(season, 1.0)
    geyser_mult = {"Summer": 0.25, "Monsoon": 0.9, "Winter": 1.65, "Spring": 0.70}.get(season, 1.0)
    fridge_mult = {"Summer": 1.20, "Monsoon": 1.0, "Winter": 0.85, "Spring": 0.95}.get(season, 1.0)
    fan_mult = {"Summer": 1.25, "Monsoon": 1.0, "Winter": 0.45, "Spring": 0.85}.get(season, 1.0)

    total_kwh = 0.0

    for app_key, spec in APPLIANCE_SPECS.items():
        count = float(row.get(f"{app_key}_count", 0))
        hours = float(row.get(f"{app_key}_hours", 0.0))

        if count <= 0 or hours <= 0:
            continue

        base_kw = spec["base_kw"]
        duty_cycle = spec.get("duty_cycle", 1.0)
        effective_kw = base_kw * duty_cycle

        if app_key == "ac":
            kwh = count * (hours * ac_mult) * effective_kw * 30
        elif app_key == "air_cooler":
            kwh = count * (hours * cooler_mult) * effective_kw * 30
        elif app_key in ["water_heater", "immersion_rod"]:
            kwh = count * (hours * geyser_mult) * effective_kw * 30
        elif app_key == "fridge":
            kwh = count * (hours * fridge_mult) * effective_kw * 30
        elif app_key == "fan":
            kwh = count * (hours * fan_mult) * effective_kw * 30
        else:
            kwh = count * hours * effective_kw * 30

        total_kwh += kwh

    # Standby losses & baseline continuous load
    area = float(row.get("area_sqft", 1100.0))
    occupants = float(row.get("occupants", 3))
    baseline_standby = 8.0 + (area / 200.0) * 0.5 + (occupants * 1.0)
    total_kwh += baseline_standby

    if include_noise:
        total_kwh *= random.gauss(1.0, 0.025)
    total_kwh = max(15.0, total_kwh)

    return round(float(total_kwh), 2)
