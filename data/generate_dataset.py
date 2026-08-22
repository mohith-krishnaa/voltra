"""
Smart Electricity Bill Predictor - Synthetic Training Data Generator (v2.0)
Expanded with 22+ comprehensive home appliances, accurate physics & standby loads.
"""

import os
import numpy as np
import pandas as pd

# Comprehensive Appliance Wattage Specs (base_kw in kW, duty_cycle factor) & realistic baseline properties
# base_kw represents rated appliance power; duty_cycle represents realistic active/compressor duty factor.
# effective_kw = base_kw * duty_cycle
APPLIANCE_SPECS = {
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

def calculate_physics_units(row: dict, include_noise: bool = False) -> float:
    """Computes exact physical monthly kWh consumption across all 22+ appliances."""
    season = row.get("season", "Summer")
    
    # Seasonal multipliers
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

    # Keep API predictions deterministic; only synthetic training rows need noise.
    if include_noise:
        total_kwh *= np.random.normal(1.0, 0.025)
    total_kwh = max(15.0, total_kwh)

    return round(float(total_kwh), 2)


def generate_dataset(num_samples: int = 12000, output_path: str = "electricity_data.csv") -> pd.DataFrame:
    """Generates synthetic dataset covering all 22+ appliance profiles."""
    np.random.seed(42)
    records = []
    house_types = list(HOUSE_PROFILES.keys())

    for i in range(num_samples):
        ht = np.random.choice(house_types, p=[0.25, 0.40, 0.25, 0.10])
        profile = HOUSE_PROFILES[ht]

        area_sqft = int(np.random.uniform(profile["area_range"][0], profile["area_range"][1]))
        occupants = int(np.random.randint(profile["occ_range"][0], profile["occ_range"][1] + 1))
        season = np.random.choice(SEASONS, p=[0.35, 0.20, 0.25, 0.20])
        tariff_zone = np.random.choice(TARIFF_ZONES)

        has_ac = np.random.rand() < profile["ac_prob"]
        ac_count = int(np.random.choice([1, 2, 3, 4], p=[0.45, 0.35, 0.15, 0.05])) if has_ac else 0
        ac_hours = round(float(np.random.uniform(2.0, 12.0)), 1) if ac_count > 0 else 0.0

        has_cooler = (not has_ac) or (np.random.rand() < 0.3)
        cooler_count = 1 if has_cooler else 0
        cooler_hours = round(float(np.random.uniform(4.0, 14.0)), 1) if cooler_count > 0 else 0.0

        fridge_count = 1 if ht != "Villa-Independent" else int(np.random.choice([1, 2], p=[0.7, 0.3]))
        fridge_hours = 24.0

        fan_count = int(np.random.randint(profile["fan_range"][0], profile["fan_range"][1] + 1))
        fan_hours = round(float(np.random.uniform(4.0, 16.0)), 1)

        light_count = int(np.random.randint(profile["light_range"][0], profile["light_range"][1] + 1))
        light_hours = round(float(np.random.uniform(3.0, 9.0)), 1)

        water_heater_count = int(np.random.choice([0, 1, 2, 3], p=[0.20, 0.50, 0.22, 0.08]))
        water_heater_hours = round(float(np.random.uniform(0.4, 2.5)), 1) if water_heater_count > 0 else 0.0

        immersion_count = 1 if (water_heater_count == 0 and np.random.rand() < 0.4) else 0
        immersion_hours = 0.5 if immersion_count > 0 else 0.0

        air_purifier_count = 1 if np.random.rand() < 0.25 else 0
        air_purifier_hours = round(float(np.random.uniform(4.0, 12.0)), 1) if air_purifier_count > 0 else 0.0

        rice_cooker_count = 1 if np.random.rand() < 0.70 else 0
        rice_cooker_hours = round(float(np.random.uniform(0.5, 1.5)), 1) if rice_cooker_count > 0 else 0.0

        mixer_count = 1 if np.random.rand() < 0.90 else 0
        mixer_hours = round(float(np.random.uniform(0.2, 0.8)), 1) if mixer_count > 0 else 0.0

        wet_grinder_count = 1 if np.random.rand() < 0.45 else 0
        wet_grinder_hours = round(float(np.random.uniform(0.3, 1.0)), 1) if wet_grinder_count > 0 else 0.0

        induction_count = 1 if np.random.rand() < 0.40 else 0
        induction_hours = round(float(np.random.uniform(0.5, 2.0)), 1) if induction_count > 0 else 0.0

        microwave_count = int(np.random.choice([0, 1, 2], p=[0.40, 0.55, 0.05]))
        microwave_hours = round(float(np.random.uniform(0.2, 1.0)), 1) if microwave_count > 0 else 0.0

        kettle_count = 1 if np.random.rand() < 0.60 else 0
        kettle_hours = round(float(np.random.uniform(0.1, 0.5)), 1) if kettle_count > 0 else 0.0

        purifier_count = 1 if np.random.rand() < 0.80 else 0
        purifier_hours = round(float(np.random.uniform(1.0, 4.0)), 1) if purifier_count > 0 else 0.0

        dishwasher_count = 1 if (ht in ["Apartment-3BHK", "Villa-Independent"] and np.random.rand() < 0.35) else 0
        dishwasher_hours = 1.0 if dishwasher_count > 0 else 0.0

        mobile_count = max(1, occupants + int(np.random.choice([0, 1, 2], p=[0.5, 0.35, 0.15])))
        mobile_hours = round(float(np.random.uniform(2.0, 5.0)), 1)

        earbuds_count = max(0, occupants - 1)
        earbuds_hours = round(float(np.random.uniform(1.0, 3.0)), 1) if earbuds_count > 0 else 0.0

        laptop_count = int(np.random.choice([1, 2, 3, 4], p=[0.4, 0.35, 0.18, 0.07]))
        laptop_hours = round(float(np.random.uniform(3.0, 10.0)), 1)

        speaker_count = int(np.random.choice([0, 1, 2], p=[0.3, 0.55, 0.15]))
        speaker_hours = round(float(np.random.uniform(1.0, 6.0)), 1) if speaker_count > 0 else 0.0

        tv_count = int(np.random.choice([0, 1, 2, 3], p=[0.05, 0.65, 0.25, 0.05]))
        tv_hours = round(float(np.random.uniform(1.5, 7.0)), 1) if tv_count > 0 else 0.0

        gaming_count = 1 if np.random.rand() < 0.25 else 0
        gaming_hours = round(float(np.random.uniform(1.0, 4.0)), 1) if gaming_count > 0 else 0.0

        router_count = 1
        router_hours = 24.0

        iron_count = 1 if np.random.rand() < 0.85 else 0
        iron_hours = round(float(np.random.uniform(0.3, 1.2)), 1) if iron_count > 0 else 0.0

        wm_count = int(np.random.choice([0, 1, 2], p=[0.10, 0.85, 0.05]))
        wm_hours = round(float(np.random.uniform(0.5, 2.0)), 1) if wm_count > 0 else 0.0

        vacuum_count = 1 if np.random.rand() < 0.30 else 0
        vacuum_hours = round(float(np.random.uniform(0.3, 0.8)), 1) if vacuum_count > 0 else 0.0

        hair_dryer_count = 1 if np.random.rand() < 0.50 else 0
        hair_dryer_hours = round(float(np.random.uniform(0.1, 0.4)), 1) if hair_dryer_count > 0 else 0.0

        ev_count = 1 if np.random.rand() < 0.10 else 0
        ev_hours = round(float(np.random.uniform(2.0, 5.0)), 1) if ev_count > 0 else 0.0

        row = {
            "house_type": ht,
            "area_sqft": area_sqft,
            "occupants": occupants,
            "season": season,
            "tariff_zone": tariff_zone,
            "ac_count": ac_count, "ac_hours": ac_hours,
            "air_cooler_count": cooler_count, "air_cooler_hours": cooler_hours,
            "fan_count": fan_count, "fan_hours": fan_hours,
            "water_heater_count": water_heater_count, "water_heater_hours": water_heater_hours,
            "immersion_rod_count": immersion_count, "immersion_rod_hours": immersion_hours,
            "air_purifier_count": air_purifier_count, "air_purifier_hours": air_purifier_hours,
            "fridge_count": fridge_count, "fridge_hours": fridge_hours,
            "rice_cooker_count": rice_cooker_count, "rice_cooker_hours": rice_cooker_hours,
            "mixer_grinder_count": mixer_count, "mixer_grinder_hours": mixer_hours,
            "wet_grinder_count": wet_grinder_count, "wet_grinder_hours": wet_grinder_hours,
            "induction_cooktop_count": induction_count, "induction_cooktop_hours": induction_hours,
            "microwave_count": microwave_count, "microwave_hours": microwave_hours,
            "electric_kettle_count": kettle_count, "electric_kettle_hours": kettle_hours,
            "water_purifier_count": purifier_count, "water_purifier_hours": purifier_hours,
            "dishwasher_count": dishwasher_count, "dishwasher_hours": dishwasher_hours,
            "mobile_chargers_count": mobile_count, "mobile_chargers_hours": mobile_hours,
            "earbuds_chargers_count": earbuds_count, "earbuds_chargers_hours": earbuds_hours,
            "laptop_computer_count": laptop_count, "laptop_computer_hours": laptop_hours,
            "smart_speakers_count": speaker_count, "smart_speakers_hours": speaker_hours,
            "tv_home_theater_count": tv_count, "tv_home_theater_hours": tv_hours,
            "gaming_console_count": gaming_count, "gaming_console_hours": gaming_hours,
            "wifi_router_count": router_count, "wifi_router_hours": router_hours,
            "iron_box_count": iron_count, "iron_box_hours": iron_hours,
            "washing_machine_count": wm_count, "washing_machine_hours": wm_hours,
            "vacuum_cleaner_count": vacuum_count, "vacuum_cleaner_hours": vacuum_hours,
            "hair_dryer_count": hair_dryer_count, "hair_dryer_hours": hair_dryer_hours,
            "ev_charger_count": ev_count, "ev_charger_hours": ev_hours,
            "light_count": light_count, "light_hours": light_hours,
        }

        row["monthly_kwh"] = calculate_physics_units(row, include_noise=True)
        records.append(row)

    df = pd.DataFrame(records)
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[Dataset] Generated {len(df)} records for 22+ appliances at '{output_path}'.")
    return df

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(current_dir, "electricity_data.csv")
    generate_dataset(num_samples=12000, output_path=output_file)
