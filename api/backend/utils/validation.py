"""
Smart Electricity Bill Predictor - Input Validation & Bounds Checking (v2.0)
"""

from typing import Dict, Any

ALLOWED_HOUSE_TYPES = ["Apartment-1BHK", "Apartment-2BHK", "Apartment-3BHK", "Villa-Independent"]
ALLOWED_SEASONS = ["Summer", "Monsoon", "Winter", "Spring"]
ALLOWED_TARIFF_ZONES = [
    "TGSPDCL-Telangana", 
    "APSPDCL-AP", 
    "TNEB-Urban", 
    "BESCOM-City", 
    "MSEDCL-Metro", 
    "BSES-Delhi",
    "UPPCL-Urban",
    "Tiered-Standard", 
    "Green-Slab"
]

APPLIANCE_KEYS = [
    "ac", "air_cooler", "fan", "water_heater", "immersion_rod", "air_purifier",
    "fridge", "rice_cooker", "mixer_grinder", "wet_grinder", "induction_cooktop",
    "microwave", "electric_kettle", "water_purifier", "dishwasher",
    "mobile_chargers", "earbuds_chargers", "laptop_computer", "smart_speakers",
    "tv_home_theater", "gaming_console", "wifi_router",
    "iron_box", "washing_machine", "vacuum_cleaner", "hair_dryer", "ev_charger", "light"
]

def sanitize_household_input(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validates and bounds-checks household profile parameters."""
    house_type = data.get("house_type", "Apartment-2BHK")
    if house_type not in ALLOWED_HOUSE_TYPES:
        house_type = "Apartment-2BHK"
        
    season = data.get("season", "Summer")
    if season not in ALLOWED_SEASONS:
        season = "Summer"
        
    tariff_zone = data.get("tariff_zone", "TGSPDCL-Telangana")
    if tariff_zone not in ALLOWED_TARIFF_ZONES:
        tariff_zone = "TGSPDCL-Telangana"
        
    area_sqft = max(100.0, min(10000.0, float(data.get("area_sqft", 1150.0))))
    occupants = max(1, min(20, int(data.get("occupants", 3))))
    enable_gruha_jyothi = bool(data.get("enable_gruha_jyothi", False))
    
    return {
        "house_type": house_type,
        "season": season,
        "tariff_zone": tariff_zone,
        "area_sqft": area_sqft,
        "occupants": occupants,
        "enable_gruha_jyothi": enable_gruha_jyothi
    }

def sanitize_appliances_input(appliances: Dict[str, Dict[str, float]]) -> Dict[str, Dict[str, float]]:
    """Validates and bounds-checks appliance count and daily usage hours."""
    sanitized = {}
    for key in APPLIANCE_KEYS:
        app_data = appliances.get(key, {})
        count = max(0, min(25, int(app_data.get("count", 0))))
        hours = max(0.0, min(24.0, float(app_data.get("hours", 0.0))))
        
        if key in ["fridge", "wifi_router"] and count > 0:
            hours = 24.0
            
        sanitized[key] = {"count": count, "hours": hours}
        
    return sanitized
