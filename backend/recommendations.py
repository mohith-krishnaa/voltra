"""
Smart Electricity Bill Predictor - Personalized Savings Recommendations (v2.0)
Generates high-impact actionable advice across all 22+ home appliances.
"""

from typing import List, Dict, Any

CO2_KG_PER_KWH = 0.82

def generate_actionable_tips(
    appliance_breakdown: List[Dict[str, Any]], 
    total_bill: float, 
    total_units: float,
    effective_rate: float,
    slab_breakdown: List[Dict[str, Any]] = None,
    applied_category: str = ""
) -> List[Dict[str, Any]]:
    """
    Analyzes consumption breakdown across 22+ appliances and returns prioritized recommendations.
    """
    tips = []
    effective_rate = max(4.0, effective_rate)
    
    # Sort appliances by units consumed descending
    sorted_appliances = sorted(appliance_breakdown, key=lambda x: x["monthly_kwh"], reverse=True)
    
    # 1. Check TGSPDCL / Slab Threshold Leakage
    if "LT-I(B)" in applied_category or (slab_breakdown and any(s["active"] and s["units"] < 25 for s in slab_breakdown)):
        if 100 < total_units <= 125:
            overage = total_units - 100
            tips.append({
                "category": "🚨 TGSPDCL Tier Alert",
                "appliance": "Whole Home",
                "icon": "TrendingDown",
                "title": "Crossed into TGSPDCL Category B (>100 Units)",
                "description": f"You consumed {total_units} units, crossing the 100-unit threshold by just {overage:.1f} units! Category A rates jump from ₹1.95/₹3.10 to ₹3.40/₹4.80. Trimming just 30 mins of AC or Cooler drops you back to Category A, saving ~₹240.",
                "monthly_kwh_savings": round(overage, 1),
                "monthly_cost_savings": round(overage * 8.0),
                "co2_savings_kg": round(overage * CO2_KG_PER_KWH, 1),
                "difficulty": "High Priority",
                "payback": "Immediate"
            })
        elif 200 < total_units <= 230:
            overage = total_units - 200
            tips.append({
                "category": "🚨 TGSPDCL Tier Alert",
                "appliance": "Whole Home",
                "icon": "TrendingDown",
                "title": "Crossed 200 Units (Losing Gruha Jyothi / Cat B-ii)",
                "description": f"At {total_units} units, you entered Category B(ii) (rates jump to ₹5.10–₹7.70) and lose the 200-unit free subsidy! Trimming {overage:.1f} units keeps your bill under 200 units for massive savings.",
                "monthly_kwh_savings": round(overage, 1),
                "monthly_cost_savings": round(overage * 12.0),
                "co2_savings_kg": round(overage * CO2_KG_PER_KWH, 1),
                "difficulty": "High Priority",
                "payback": "Immediate"
            })

    for app in sorted_appliances:
        name = app["appliance"]
        kwh = app["monthly_kwh"]
        pct = app["percentage"]
        count = app.get("count", 1)
        hours = app.get("hours_per_day", 0.0)

        if name == "ac" and kwh > 40.0:
            thermostat_savings_kwh = round(kwh * 0.24, 1)
            tips.append({
                "category": "High Impact",
                "appliance": "Air Conditioner",
                "icon": "AirVent",
                "title": "Set AC Thermostat to 24°C + Ceiling Fan",
                "description": f"AC consumes {pct}% ({kwh} kWh) of your bill. Running at 24°C instead of 18-20°C reduces compressor work by ~24%, saving ~₹{round(thermostat_savings_kwh * effective_rate)}/month.",
                "monthly_kwh_savings": thermostat_savings_kwh,
                "monthly_cost_savings": round(thermostat_savings_kwh * effective_rate),
                "co2_savings_kg": round(thermostat_savings_kwh * CO2_KG_PER_KWH, 1),
                "difficulty": "Easy",
                "payback": "Immediate"
            })

        elif name == "air_cooler" and kwh > 30.0:
            cooler_savings_kwh = round(kwh * 0.20, 1)
            tips.append({
                "category": "Climate Efficiency",
                "appliance": "Air Cooler",
                "icon": "Fan",
                "title": "Ensure Cross-Ventilation for Desert Cooler",
                "description": f"Air coolers operate most efficiently with an open window for air exhaust, reducing humidity build-up and motor load by 20%.",
                "monthly_kwh_savings": cooler_savings_kwh,
                "monthly_cost_savings": round(cooler_savings_kwh * effective_rate),
                "co2_savings_kg": round(cooler_savings_kwh * CO2_KG_PER_KWH, 1),
                "difficulty": "Easy",
                "payback": "Immediate"
            })

        elif name in ["water_heater", "immersion_rod"] and kwh > 25.0:
            wh_savings_kwh = round(kwh * 0.35, 1)
            tips.append({
                "category": "Thermal Timer",
                "appliance": "Water Heater",
                "icon": "Flame",
                "title": "Limit Geyser Heating to 20 Minutes",
                "description": f"Water heaters pull 2.2 kW constantly. Turning it off after 20 mins prevents standing tank heat loss, saving ~₹{round(wh_savings_kwh * effective_rate)}/month.",
                "monthly_kwh_savings": wh_savings_kwh,
                "monthly_cost_savings": round(wh_savings_kwh * effective_rate),
                "co2_savings_kg": round(wh_savings_kwh * CO2_KG_PER_KWH, 1),
                "difficulty": "Easy",
                "payback": "Immediate"
            })

        elif name == "mobile_chargers" and count >= 3:
            vampire_kwh = round(count * 4.5, 1)
            tips.append({
                "category": "Phantom Load",
                "appliance": "Mobile Chargers",
                "icon": "Zap",
                "title": "Unplug Idle Fast Chargers (Vampire Draw)",
                "description": f"You have {count} chargers plugged in. Modern 65W/100W GaN chargers consume 0.5W–1.5W idle even when no phone is connected. Turn wall switches off.",
                "monthly_kwh_savings": vampire_kwh,
                "monthly_cost_savings": round(vampire_kwh * effective_rate),
                "co2_savings_kg": round(vampire_kwh * CO2_KG_PER_KWH, 1),
                "difficulty": "Easy",
                "payback": "Immediate"
            })

        elif name == "rice_cooker" and kwh > 15.0:
            rc_savings = round(kwh * 0.30, 1)
            tips.append({
                "category": "Kitchen Habit",
                "appliance": "Rice Cooker",
                "icon": "Utensils",
                "title": "Switch Off 'Keep Warm' Mode on Rice Cooker",
                "description": "The 'Keep Warm' heating coil continuously draws 50W–70W for hours after cooking. Disconnecting it saves ~30% of its total monthly power.",
                "monthly_kwh_savings": rc_savings,
                "monthly_cost_savings": round(rc_savings * effective_rate),
                "co2_savings_kg": round(rc_savings * CO2_KG_PER_KWH, 1),
                "difficulty": "Easy",
                "payback": "Immediate"
            })

        elif name == "iron_box" and kwh > 12.0:
            iron_savings = round(kwh * 0.25, 1)
            tips.append({
                "category": "Care Habit",
                "appliance": "Iron Box",
                "icon": "Shirt",
                "title": "Batch Clothes Ironing Once a Week",
                "description": "Heating up a 1200W iron from cold uses maximum power. Ironing all weekly clothes in one session utilizes residual heat and saves 25%.",
                "monthly_kwh_savings": iron_savings,
                "monthly_cost_savings": round(iron_savings * effective_rate),
                "co2_savings_kg": round(iron_savings * CO2_KG_PER_KWH, 1),
                "difficulty": "Easy",
                "payback": "Immediate"
            })

        elif name == "fan" and kwh > 40.0 and count >= 3:
            bldc_savings = round(kwh * 0.58, 1)
            tips.append({
                "category": "Hardware Upgrade",
                "appliance": "Ceiling Fans",
                "icon": "Fan",
                "title": "Upgrade to 28W BLDC Fans",
                "description": f"Running {count} standard induction fans uses {kwh} kWh. 5-Star BLDC inverter fans consume 28W vs 75W, saving ~₹{round(bldc_savings * effective_rate)}/month.",
                "monthly_kwh_savings": bldc_savings,
                "monthly_cost_savings": round(bldc_savings * effective_rate),
                "co2_savings_kg": round(bldc_savings * CO2_KG_PER_KWH, 1),
                "difficulty": "Medium",
                "payback": "6 Months"
            })

    if len(tips) < 2:
        tips.append({
            "category": "General Advice",
            "appliance": "Standby Power",
            "icon": "Zap",
            "title": "Eliminate Standby / Phantom Power",
            "description": "TV set-top boxes, microwave clocks, and gaming consoles in standby draw 5-10% of household baseload power.",
            "monthly_kwh_savings": 14.0,
            "monthly_cost_savings": round(14.0 * effective_rate),
            "co2_savings_kg": round(14.0 * CO2_KG_PER_KWH, 1),
            "difficulty": "Easy",
            "payback": "Immediate"
        })

    return tips[:5]
