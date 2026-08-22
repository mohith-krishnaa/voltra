"""
Smart Electricity Bill Predictor - Official State Utility Tariff Engine (v2.0)
Accurately implements TGSPDCL (Telangana), APSPDCL, TNEB, BESCOM, MSEDCL, Delhi BSES & Custom Tariffs.
"""

from typing import Dict, List, Any, Optional

TARIFF_SCHEMES = {
    "TGSPDCL-Telangana": {
        "name": "TGSPDCL (Telangana Southern Power) - Official LT-1",
        "state": "Telangana",
        "board_code": "TGSPDCL",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 50.0, # Customer charges based on category
        "duty_rate_per_kwh": 0.06, # 6 paise per unit electricity duty
        "is_telescopic_category": True,
        "categories": {
            "LT-I(A)": {
                "max_units": 100,
                "customer_charge": 25.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 50, "rate": 1.95, "label": "0 - 50 Units (Category A)"},
                    {"from_unit": 50, "to_unit": 100, "rate": 3.10, "label": "51 - 100 Units (Category A)"},
                ]
            },
            "LT-I(B)(i)": {
                "max_units": 200,
                "customer_charge": 50.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 100, "rate": 3.40, "label": "0 - 100 Units (Category B-i)"},
                    {"from_unit": 100, "to_unit": 200, "rate": 4.80, "label": "101 - 200 Units (Category B-i)"},
                ]
            },
            "LT-I(B)(ii)": {
                "max_units": float("inf"),
                "customer_charge": 80.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 200, "rate": 5.10, "label": "0 - 200 Units (Category B-ii)"},
                    {"from_unit": 200, "to_unit": 300, "rate": 7.70, "label": "201 - 300 Units"},
                    {"from_unit": 300, "to_unit": 400, "rate": 9.00, "label": "301 - 400 Units"},
                    {"from_unit": 400, "to_unit": 800, "rate": 9.50, "label": "401 - 800 Units"},
                    {"from_unit": 800, "to_unit": float("inf"), "rate": 10.00, "label": "> 800 Units (Peak Tier)"},
                ]
            }
        }
    },
    "APSPDCL-AP": {
        "name": "APSPDCL / APEPDCL (Andhra Pradesh Domestic)",
        "state": "Andhra Pradesh",
        "board_code": "APSPDCL",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 45.0,
        "duty_rate_per_kwh": 0.06,
        "slabs": [
            {"from_unit": 0, "to_unit": 50, "rate": 1.90, "label": "0 - 50 Units"},
            {"from_unit": 50, "to_unit": 100, "rate": 3.00, "label": "51 - 100 Units"},
            {"from_unit": 100, "to_unit": 200, "rate": 4.50, "label": "101 - 200 Units"},
            {"from_unit": 200, "to_unit": 300, "rate": 6.85, "label": "201 - 300 Units"},
            {"from_unit": 300, "to_unit": 400, "rate": 7.90, "label": "301 - 400 Units"},
            {"from_unit": 400, "to_unit": float("inf"), "rate": 9.80, "label": "> 400 Units"},
        ]
    },
    "TNEB-Urban": {
        "name": "TANGEDCO / TNEB (Tamil Nadu Domestic)",
        "state": "Tamil Nadu",
        "board_code": "TNEB",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 50.0,
        "duty_rate": 0.05,
        "slabs": [
            {"from_unit": 0, "to_unit": 100, "rate": 0.00, "label": "0 - 100 Units (Free Govt Subsidy)"},
            {"from_unit": 100, "to_unit": 200, "rate": 2.25, "label": "101 - 200 Units"},
            {"from_unit": 200, "to_unit": 400, "rate": 4.50, "label": "201 - 400 Units"},
            {"from_unit": 400, "to_unit": 500, "rate": 6.00, "label": "401 - 500 Units"},
            {"from_unit": 500, "to_unit": float("inf"), "rate": 8.00, "label": "> 500 Units"},
        ]
    },
    "BESCOM-City": {
        "name": "BESCOM (Bangalore / Karnataka)",
        "state": "Karnataka",
        "board_code": "BESCOM",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 90.0,
        "duty_rate": 0.09,
        "slabs": [
            {"from_unit": 0, "to_unit": 50, "rate": 4.15, "label": "0 - 50 Units"},
            {"from_unit": 50, "to_unit": 100, "rate": 5.60, "label": "51 - 100 Units"},
            {"from_unit": 100, "to_unit": 200, "rate": 7.15, "label": "101 - 200 Units"},
            {"from_unit": 200, "to_unit": float("inf"), "rate": 8.20, "label": "> 200 Units"},
        ]
    },
    "MSEDCL-Metro": {
        "name": "MSEDCL (Maharashtra Mahavitaran)",
        "state": "Maharashtra",
        "board_code": "MSEDCL",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 115.0,
        "duty_rate": 0.16,
        "slabs": [
            {"from_unit": 0, "to_unit": 100, "rate": 5.88, "label": "0 - 100 Units"},
            {"from_unit": 100, "to_unit": 300, "rate": 11.26, "label": "101 - 300 Units"},
            {"from_unit": 300, "to_unit": 500, "rate": 15.72, "label": "301 - 500 Units"},
            {"from_unit": 500, "to_unit": float("inf"), "rate": 17.81, "label": "> 500 Units"},
        ]
    },
    "BSES-Delhi": {
        "name": "BSES Rajdhani / Yamuna (Delhi NCT)",
        "state": "Delhi",
        "board_code": "BSES",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 60.0,
        "duty_rate": 0.05,
        "slabs": [
            {"from_unit": 0, "to_unit": 200, "rate": 3.00, "label": "0 - 200 Units (Subsidized)"},
            {"from_unit": 200, "to_unit": 400, "rate": 4.50, "label": "201 - 400 Units"},
            {"from_unit": 400, "to_unit": 800, "rate": 6.50, "label": "401 - 800 Units"},
            {"from_unit": 800, "to_unit": float("inf"), "rate": 7.00, "label": "> 800 Units"},
        ]
    },
    "UPPCL-Urban": {
        "name": "UPPCL (Uttar Pradesh Urban Domestic)",
        "state": "Uttar Pradesh",
        "board_code": "UPPCL",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 110.0,
        "duty_rate": 0.05,
        "slabs": [
            {"from_unit": 0, "to_unit": 150, "rate": 5.50, "label": "0 - 150 Units"},
            {"from_unit": 150, "to_unit": 300, "rate": 6.00, "label": "151 - 300 Units"},
            {"from_unit": 300, "to_unit": 500, "rate": 6.50, "label": "301 - 500 Units"},
            {"from_unit": 500, "to_unit": float("inf"), "rate": 7.00, "label": "> 500 Units"},
        ]
    },
    "Tiered-Standard": {
        "name": "Standard Progressive Benchmark",
        "state": "National",
        "board_code": "STANDARD",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 60.0,
        "duty_rate": 0.05,
        "slabs": [
            {"from_unit": 0, "to_unit": 100, "rate": 2.50, "label": "0 - 100 Units (Subsidized)"},
            {"from_unit": 100, "to_unit": 200, "rate": 4.25, "label": "101 - 200 Units (Base)"},
            {"from_unit": 200, "to_unit": 400, "rate": 6.50, "label": "201 - 400 Units (Standard)"},
            {"from_unit": 400, "to_unit": 800, "rate": 8.20, "label": "401 - 800 Units (High)"},
            {"from_unit": 800, "to_unit": float("inf"), "rate": 9.75, "label": "> 800 Units (Peak)"},
        ]
    },
    "Green-Slab": {
        "name": "Eco / Smart Green Tariff",
        "state": "Green Grid",
        "board_code": "GREEN",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 40.0,
        "duty_rate": 0.04,
        "slabs": [
            {"from_unit": 0, "to_unit": 150, "rate": 2.00, "label": "0 - 150 Units (Eco Saver)"},
            {"from_unit": 150, "to_unit": 300, "rate": 4.80, "label": "151 - 300 Units (Normal)"},
            {"from_unit": 300, "to_unit": float("inf"), "rate": 9.00, "label": "> 300 Units (High Impact)"},
        ]
    }
}

def _compute_slabs(units: float, slabs: List[Dict[str, Any]]) -> tuple[float, List[Dict[str, Any]]]:
    """
    Helper function to walk slab ranges and compute progressive energy charges.
    Returns (energy_charge, slab_breakdowns).
    """
    energy_charge = 0.0
    slab_breakdowns: List[Dict[str, Any]] = []
    remaining_units = units

    for slab in slabs:
        from_u = slab["from_unit"]
        to_u = slab["to_unit"]
        rate = slab["rate"]
        capacity = to_u - from_u

        if units > from_u:
            slab_units = min(remaining_units, capacity)
            slab_cost = slab_units * rate
            energy_charge += slab_cost
            remaining_units -= slab_units
            slab_breakdowns.append({
                "label": slab["label"],
                "units": round(slab_units, 2),
                "rate": rate,
                "amount": round(slab_cost, 2),
                "active": True
            })
        else:
            slab_breakdowns.append({
                "label": slab["label"],
                "units": 0.0,
                "rate": rate,
                "amount": 0.0,
                "active": False
            })

    return energy_charge, slab_breakdowns


def calculate_bill_from_units(
    units: float, 
    tariff_zone: str = "TGSPDCL-Telangana",
    enable_gruha_jyothi: bool = False
) -> Dict[str, Any]:
    """
    Computes an itemized electricity bill breakdown using official progressive utility slabs.
    Handles TGSPDCL telescopic category thresholds and Gruha Jyothi subsidy scheme.
    """
    scheme = TARIFF_SCHEMES.get(tariff_zone, TARIFF_SCHEMES["TGSPDCL-Telangana"])
    units = max(0.0, float(units))
    
    applied_category = "Standard Domestic"
    fixed_charge = scheme.get("fixed_charge", 50.0)

    # 1. Telescopic Category or Standard Progressive Slab Selection
    if scheme.get("is_telescopic_category") and "categories" in scheme:
        if units <= 100:
            applied_category = "LT-I(A) (≤ 100 Units)"
            cat_info = scheme["categories"]["LT-I(A)"]
        elif units <= 200:
            applied_category = "LT-I(B)(i) (101 - 200 Units)"
            cat_info = scheme["categories"]["LT-I(B)(i)"]
        else:
            applied_category = "LT-I(B)(ii) (> 200 Units)"
            cat_info = scheme["categories"]["LT-I(B)(ii)"]

        fixed_charge = cat_info["customer_charge"]
        energy_charge, slab_breakdowns = _compute_slabs(units, cat_info["slabs"])
    else:
        energy_charge, slab_breakdowns = _compute_slabs(units, scheme.get("slabs", []))

    # Electricity Duty & Surcharges
    if "duty_rate_per_kwh" in scheme:
        duty_amount = units * scheme["duty_rate_per_kwh"]
        duty_rate_label = f"₹{scheme['duty_rate_per_kwh']}/kWh"
    else:
        duty_pct = scheme.get("duty_rate", 0.05)
        duty_amount = (energy_charge + fixed_charge) * duty_pct
        duty_rate_label = f"{round(duty_pct * 100, 1)}%"

    # Do not invent a fuel surcharge: boards publish it separately and it changes
    # by billing period. A scheme can opt in by defining ``fsa_rate_per_kwh``.
    fsa_charge = round(units * scheme.get("fsa_rate_per_kwh", 0.0), 2)
    
    subtotal = energy_charge + fixed_charge + duty_amount + fsa_charge

    # Gruha Jyothi Scheme Subsidy Check (Telangana / Karnataka 200 units free)
    subsidy_amount = 0.0
    subsidy_applied = False
    if enable_gruha_jyothi and tariff_zone == "TGSPDCL-Telangana":
        if units <= 200:
            subsidy_applied = True
            subsidy_amount = subtotal # 100% Free under 200 units
        else:
            subsidy_applied = False # Ineligible if exceeding 200 units

    total_bill = max(0.0, subtotal - subsidy_amount)
    effective_rate = (total_bill / units) if units > 0 else 0.0

    return {
        "tariff_zone": tariff_zone,
        "tariff_name": scheme["name"],
        "state": scheme.get("state", "National"),
        "board_code": scheme.get("board_code", "GEN"),
        "applied_category": applied_category,
        "currency_symbol": scheme["symbol"],
        "currency": scheme["currency"],
        "total_units": round(units, 2),
        "energy_charge": round(energy_charge, 2),
        "fixed_charge": round(fixed_charge, 2),
        "duty_rate_label": duty_rate_label,
        "duty_amount": round(duty_amount, 2),
        "fsa_charge": fsa_charge,
        "subtotal_before_subsidy": round(subtotal, 2),
        "gruha_jyothi_enabled": enable_gruha_jyothi,
        "subsidy_applied": subsidy_applied,
        "subsidy_amount": round(subsidy_amount, 2),
        "total_bill": round(total_bill, 2),
        "effective_rate_per_kwh": round(effective_rate, 2),
        "slab_breakdown": slab_breakdowns
    }

def get_available_tariffs() -> List[Dict[str, Any]]:
    """Returns metadata for all available utility zones."""
    return [
        {
            "id": k,
            "name": v["name"],
            "state": v.get("state", "India"),
            "board_code": v.get("board_code", k),
            "currency_symbol": v["symbol"],
            "fixed_charge": v.get("fixed_charge", 50.0),
        }
        for k, v in TARIFF_SCHEMES.items()
    ]
