"""
Smart Electricity Bill Predictor - Official State Utility Tariff Engine (v2.0)
Accurately implements official State Electricity Board & DISCOM tariff slabs:
- Telangana: TGSPDCL (South) & TGNPDCL (North) with Gruha Jyothi 200 units zero-bill
- Andhra Pradesh: APSPDCL (South), APEPDCL (East), APCPDCL (Central) with 3-Group slabs
- Karnataka: BESCOM, HESCOM, MESCOM with Gruha Jyothi scheme
- Tamil Nadu: TANGEDCO (TNEB) with 100 units universal free subsidy
- Maharashtra: MSEDCL (Mahavitaran) with progressive slabs
- Delhi NCT: BSES Rajdhani / Yamuna / TPDDL with Delhi 200 units zero-bill subsidy
- Uttar Pradesh: UPPCL (PVVNL, MVVNL, DVVNL, PuVVNL)
- Gujarat: GUVCL (DGVCL, MGVCL, PGVCL, UGVCL)
- Kerala: KSEB Domestic telescopic & non-telescopic
"""

from __future__ import annotations
from typing import Dict, List, Any, Optional, Tuple

TARIFF_SCHEMES: Dict[str, Dict[str, Any]] = {
    # --------------------------------------------------------------------------
    # 1. TELANGANA STATE BOARDS
    # --------------------------------------------------------------------------
    "TGSPDCL-Telangana": {
        "name": "TGSPDCL (Telangana Southern Power) - Official LT-1",
        "state": "Telangana",
        "board_code": "TGSPDCL",
        "region": "Hyderabad, Ranga Reddy, Medchal, Nalgonda, Mahabubnagar, Medak",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 50.0,
        "duty_rate_per_kwh": 0.06, # 6 paise/kWh
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
    "TGNPDCL-Telangana": {
        "name": "TGNPDCL (Telangana Northern Power) - Official LT-1",
        "state": "Telangana",
        "board_code": "TGNPDCL",
        "region": "Warangal, Karimnagar, Khammam, Nizamabad, Adilabad",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 50.0,
        "duty_rate_per_kwh": 0.06,
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

    # --------------------------------------------------------------------------
    # 2. ANDHRA PRADESH STATE BOARDS
    # --------------------------------------------------------------------------
    "APSPDCL-AP": {
        "name": "APSPDCL (Andhra Pradesh Southern Power - Tirupati/Nellore/Rayalaseema)",
        "state": "Andhra Pradesh",
        "board_code": "APSPDCL",
        "region": "Tirupati, Nellore, Chittoor, Kadapa, Anantapur, Kurnool",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 50.0,
        "duty_rate_per_kwh": 0.06,
        "is_telescopic_category": True,
        "categories": {
            "Group A (≤75 units)": {
                "max_units": 75,
                "customer_charge": 25.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 30, "rate": 1.90, "label": "0 - 30 Units (Lifeline)"},
                    {"from_unit": 30, "to_unit": 75, "rate": 3.00, "label": "31 - 75 Units (Group A)"},
                ]
            },
            "Group B (76-225 units)": {
                "max_units": 225,
                "customer_charge": 50.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 50, "rate": 3.10, "label": "0 - 50 Units (Group B)"},
                    {"from_unit": 50, "to_unit": 100, "rate": 3.80, "label": "51 - 100 Units"},
                    {"from_unit": 100, "to_unit": 200, "rate": 4.80, "label": "101 - 200 Units"},
                    {"from_unit": 200, "to_unit": 225, "rate": 6.80, "label": "201 - 225 Units"},
                ]
            },
            "Group C (>225 units)": {
                "max_units": float("inf"),
                "customer_charge": 75.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 50, "rate": 3.80, "label": "0 - 50 Units (Group C)"},
                    {"from_unit": 50, "to_unit": 100, "rate": 4.80, "label": "51 - 100 Units"},
                    {"from_unit": 100, "to_unit": 200, "rate": 6.80, "label": "101 - 200 Units"},
                    {"from_unit": 200, "to_unit": 300, "rate": 7.90, "label": "201 - 300 Units"},
                    {"from_unit": 300, "to_unit": 400, "rate": 8.90, "label": "301 - 400 Units"},
                    {"from_unit": 400, "to_unit": 500, "rate": 9.90, "label": "401 - 500 Units"},
                    {"from_unit": 500, "to_unit": float("inf"), "rate": 10.90, "label": "> 500 Units"},
                ]
            }
        }
    },
    "APEPDCL-AP": {
        "name": "APEPDCL (Andhra Pradesh Eastern Power - Vizag/Godavari)",
        "state": "Andhra Pradesh",
        "board_code": "APEPDCL",
        "region": "Visakhapatnam, Srikakulam, Vizianagaram, East Godavari, West Godavari",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 50.0,
        "duty_rate_per_kwh": 0.06,
        "is_telescopic_category": True,
        "categories": {
            "Group A (≤75 units)": {
                "max_units": 75,
                "customer_charge": 25.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 30, "rate": 1.90, "label": "0 - 30 Units (Lifeline)"},
                    {"from_unit": 30, "to_unit": 75, "rate": 3.00, "label": "31 - 75 Units (Group A)"},
                ]
            },
            "Group B (76-225 units)": {
                "max_units": 225,
                "customer_charge": 50.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 50, "rate": 3.10, "label": "0 - 50 Units (Group B)"},
                    {"from_unit": 50, "to_unit": 100, "rate": 3.80, "label": "51 - 100 Units"},
                    {"from_unit": 100, "to_unit": 200, "rate": 4.80, "label": "101 - 200 Units"},
                    {"from_unit": 200, "to_unit": 225, "rate": 6.80, "label": "201 - 225 Units"},
                ]
            },
            "Group C (>225 units)": {
                "max_units": float("inf"),
                "customer_charge": 75.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 50, "rate": 3.80, "label": "0 - 50 Units (Group C)"},
                    {"from_unit": 50, "to_unit": 100, "rate": 4.80, "label": "51 - 100 Units"},
                    {"from_unit": 100, "to_unit": 200, "rate": 6.80, "label": "101 - 200 Units"},
                    {"from_unit": 200, "to_unit": 300, "rate": 7.90, "label": "201 - 300 Units"},
                    {"from_unit": 300, "to_unit": 400, "rate": 8.90, "label": "301 - 400 Units"},
                    {"from_unit": 400, "to_unit": 500, "rate": 9.90, "label": "401 - 500 Units"},
                    {"from_unit": 500, "to_unit": float("inf"), "rate": 10.90, "label": "> 500 Units"},
                ]
            }
        }
    },
    "APCPDCL-AP": {
        "name": "APCPDCL (Andhra Pradesh Central Power - Vijayawada/Guntur)",
        "state": "Andhra Pradesh",
        "board_code": "APCPDCL",
        "region": "Vijayawada, Guntur, Krishna, Prakasam",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 50.0,
        "duty_rate_per_kwh": 0.06,
        "is_telescopic_category": True,
        "categories": {
            "Group A (≤75 units)": {
                "max_units": 75,
                "customer_charge": 25.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 30, "rate": 1.90, "label": "0 - 30 Units (Lifeline)"},
                    {"from_unit": 30, "to_unit": 75, "rate": 3.00, "label": "31 - 75 Units (Group A)"},
                ]
            },
            "Group B (76-225 units)": {
                "max_units": 225,
                "customer_charge": 50.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 50, "rate": 3.10, "label": "0 - 50 Units (Group B)"},
                    {"from_unit": 50, "to_unit": 100, "rate": 3.80, "label": "51 - 100 Units"},
                    {"from_unit": 100, "to_unit": 200, "rate": 4.80, "label": "101 - 200 Units"},
                    {"from_unit": 200, "to_unit": 225, "rate": 6.80, "label": "201 - 225 Units"},
                ]
            },
            "Group C (>225 units)": {
                "max_units": float("inf"),
                "customer_charge": 75.0,
                "slabs": [
                    {"from_unit": 0, "to_unit": 50, "rate": 3.80, "label": "0 - 50 Units (Group C)"},
                    {"from_unit": 50, "to_unit": 100, "rate": 4.80, "label": "51 - 100 Units"},
                    {"from_unit": 100, "to_unit": 200, "rate": 6.80, "label": "101 - 200 Units"},
                    {"from_unit": 200, "to_unit": 300, "rate": 7.90, "label": "201 - 300 Units"},
                    {"from_unit": 300, "to_unit": 400, "rate": 8.90, "label": "301 - 400 Units"},
                    {"from_unit": 400, "to_unit": 500, "rate": 9.90, "label": "401 - 500 Units"},
                    {"from_unit": 500, "to_unit": float("inf"), "rate": 10.90, "label": "> 500 Units"},
                ]
            }
        }
    },

    # --------------------------------------------------------------------------
    # 3. KARNATAKA STATE BOARDS
    # --------------------------------------------------------------------------
    "BESCOM-Karnataka": {
        "name": "BESCOM (Bangalore / Karnataka Electricity Supply) - LT-2(a)",
        "state": "Karnataka",
        "board_code": "BESCOM",
        "region": "Bengaluru Urban, Bengaluru Rural, Kolar, Tumakuru, Ramanagara, Davanagere",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 110.0,
        "duty_rate": 0.09, # 9% electricity tax
        "slabs": [
            {"from_unit": 0, "to_unit": 100, "rate": 4.75, "label": "0 - 100 Units (Base Tier)"},
            {"from_unit": 100, "to_unit": float("inf"), "rate": 7.00, "label": "> 100 Units (Normal Tier)"},
        ]
    },

    # --------------------------------------------------------------------------
    # 4. TAMIL NADU STATE BOARDS
    # --------------------------------------------------------------------------
    "TANGEDCO-TamilNadu": {
        "name": "TANGEDCO / TNEB (Tamil Nadu Domestic with 100 Units Free Subsidy)",
        "state": "Tamil Nadu",
        "board_code": "TANGEDCO",
        "region": "Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, All TN Districts",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 50.0,
        "duty_rate": 0.05,
        "slabs": [
            {"from_unit": 0, "to_unit": 100, "rate": 0.00, "label": "0 - 100 Units (100% Free Govt Subsidy)"},
            {"from_unit": 100, "to_unit": 200, "rate": 2.25, "label": "101 - 200 Units"},
            {"from_unit": 200, "to_unit": 400, "rate": 4.50, "label": "201 - 400 Units"},
            {"from_unit": 400, "to_unit": 500, "rate": 6.00, "label": "401 - 500 Units"},
            {"from_unit": 500, "to_unit": float("inf"), "rate": 8.00, "label": "> 500 Units"},
        ]
    },

    # --------------------------------------------------------------------------
    # 5. MAHARASHTRA STATE BOARDS
    # --------------------------------------------------------------------------
    "MSEDCL-Maharashtra": {
        "name": "MSEDCL (Maharashtra Mahavitaran Domestic LT-I)",
        "state": "Maharashtra",
        "board_code": "MSEDCL",
        "region": "Mumbai Suburbs, Pune, Nagpur, Nashik, Thane, Aurangabad",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 128.0,
        "duty_rate": 0.16, # 16% electricity duty
        "slabs": [
            {"from_unit": 0, "to_unit": 100, "rate": 5.88, "label": "0 - 100 Units"},
            {"from_unit": 100, "to_unit": 300, "rate": 11.26, "label": "101 - 300 Units"},
            {"from_unit": 300, "to_unit": 500, "rate": 15.72, "label": "301 - 500 Units"},
            {"from_unit": 500, "to_unit": float("inf"), "rate": 17.81, "label": "> 500 Units"},
        ]
    },

    # --------------------------------------------------------------------------
    # 6. DELHI NCT
    # --------------------------------------------------------------------------
    "BSES-Delhi": {
        "name": "BSES Rajdhani / Yamuna (Delhi NCT Domestic)",
        "state": "Delhi",
        "board_code": "BSES",
        "region": "South Delhi, West Delhi, East Delhi, Central Delhi",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 60.0,
        "duty_rate": 0.05,
        "slabs": [
            {"from_unit": 0, "to_unit": 200, "rate": 3.00, "label": "0 - 200 Units (Subsidized Tier)"},
            {"from_unit": 200, "to_unit": 400, "rate": 4.50, "label": "201 - 400 Units"},
            {"from_unit": 400, "to_unit": 800, "rate": 6.50, "label": "401 - 800 Units"},
            {"from_unit": 800, "to_unit": float("inf"), "rate": 7.00, "label": "> 800 Units"},
        ]
    },

    # --------------------------------------------------------------------------
    # 7. UTTAR PRADESH STATE BOARDS
    # --------------------------------------------------------------------------
    "UPPCL-UP": {
        "name": "UPPCL (Uttar Pradesh Power Corp - PVVNL/MVVNL/DVVNL/PuVVNL)",
        "state": "Uttar Pradesh",
        "board_code": "UPPCL",
        "region": "Noida, Ghaziabad, Lucknow, Kanpur, Agra, Varanasi, Prayagraj",
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

    # --------------------------------------------------------------------------
    # 8. GUJARAT STATE BOARDS
    # --------------------------------------------------------------------------
    "GUVCL-Gujarat": {
        "name": "GUVCL (Gujarat Urja Vikas Nigam - DGVCL/MGVCL/PGVCL/UGVCL)",
        "state": "Gujarat",
        "board_code": "GUVCL",
        "region": "Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar, Jamnagar",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 45.0,
        "duty_rate": 0.15,
        "slabs": [
            {"from_unit": 0, "to_unit": 50, "rate": 3.05, "label": "0 - 50 Units"},
            {"from_unit": 50, "to_unit": 100, "rate": 3.50, "label": "51 - 100 Units"},
            {"from_unit": 100, "to_unit": 250, "rate": 4.15, "label": "101 - 250 Units"},
            {"from_unit": 250, "to_unit": float("inf"), "rate": 5.20, "label": "> 250 Units"},
        ]
    },

    # --------------------------------------------------------------------------
    # 9. KERALA STATE BOARD
    # --------------------------------------------------------------------------
    "KSEB-Kerala": {
        "name": "KSEB (Kerala State Electricity Board - Domestic LT-1A)",
        "state": "Kerala",
        "board_code": "KSEB",
        "region": "Thiruvananthapuram, Kochi, Kozhikode, Thrissur, Kollam",
        "currency": "INR",
        "symbol": "₹",
        "fixed_charge": 55.0,
        "duty_rate": 0.10,
        "slabs": [
            {"from_unit": 0, "to_unit": 50, "rate": 3.25, "label": "0 - 50 Units"},
            {"from_unit": 50, "to_unit": 100, "rate": 4.05, "label": "51 - 100 Units"},
            {"from_unit": 100, "to_unit": 150, "rate": 5.10, "label": "101 - 150 Units"},
            {"from_unit": 150, "to_unit": 200, "rate": 6.95, "label": "151 - 200 Units"},
            {"from_unit": 200, "to_unit": 250, "rate": 8.20, "label": "201 - 250 Units"},
            {"from_unit": 250, "to_unit": float("inf"), "rate": 8.80, "label": "> 250 Units"},
        ]
    }
}

# Alias mapping for backward compatibility
TARIFF_SCHEMES["TSSPDCL-Telangana"] = TARIFF_SCHEMES["TGSPDCL-Telangana"]
TARIFF_SCHEMES["BESCOM-City"] = TARIFF_SCHEMES["BESCOM-Karnataka"]
TARIFF_SCHEMES["BESCOM-Bangalore"] = TARIFF_SCHEMES["BESCOM-Karnataka"]
TARIFF_SCHEMES["TNEB-Urban"] = TARIFF_SCHEMES["TANGEDCO-TamilNadu"]
TARIFF_SCHEMES["TNEB-TamilNadu"] = TARIFF_SCHEMES["TANGEDCO-TamilNadu"]
TARIFF_SCHEMES["MSEDCL-Metro"] = TARIFF_SCHEMES["MSEDCL-Maharashtra"]
TARIFF_SCHEMES["UPPCL-Urban"] = TARIFF_SCHEMES["UPPCL-UP"]
TARIFF_SCHEMES["Tiered-Standard"] = TARIFF_SCHEMES["TGSPDCL-Telangana"]


def _compute_slabs(units: float, slabs: List[Dict[str, Any]]) -> Tuple[float, List[Dict[str, Any]]]:
    """Helper function to walk slab ranges and compute progressive energy charges."""
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
    Handles TG/AP telescopic categories and state-specific subsidy schemes:
    - Telangana Gruha Jyothi (200 units free)
    - Tamil Nadu TNEB (100 units universal free subsidy)
    - Delhi BSES Subsidy (100% free up to 200 units, 50% subsidy up to 400 units)
    - Karnataka Gruha Jyothi (up to 200 units free)
    """
    scheme = TARIFF_SCHEMES.get(tariff_zone, TARIFF_SCHEMES["TGSPDCL-Telangana"])
    units = max(0.0, float(units))
    
    applied_category = "Standard Domestic"
    fixed_charge = scheme.get("fixed_charge", 50.0)

    # 1. Telescopic Category or Standard Progressive Slab Selection
    if scheme.get("is_telescopic_category") and "categories" in scheme:
        selected_cat = None
        for cat_name, cat_data in scheme["categories"].items():
            if units <= cat_data["max_units"]:
                selected_cat = (cat_name, cat_data)
                break
        if not selected_cat:
            last_k = list(scheme["categories"].keys())[-1]
            selected_cat = (last_k, scheme["categories"][last_k])

        applied_category = f"{selected_cat[0]}"
        fixed_charge = selected_cat[1]["customer_charge"]
        energy_charge, slab_breakdowns = _compute_slabs(units, selected_cat[1]["slabs"])
    else:
        energy_charge, slab_breakdowns = _compute_slabs(units, scheme.get("slabs", []))

    # 2. Electricity Duty & Surcharges
    if ("TamilNadu" in tariff_zone or "TNEB" in scheme.get("board_code", "") or "TANGEDCO" in scheme.get("board_code", "")) and units <= 100:
        fixed_charge = 0.0

    if "duty_rate_per_kwh" in scheme:
        duty_amount = units * scheme["duty_rate_per_kwh"]
        duty_rate_label = f"₹{scheme['duty_rate_per_kwh']}/kWh"
    else:
        duty_pct = scheme.get("duty_rate", 0.05)
        duty_amount = (energy_charge + fixed_charge) * duty_pct
        duty_rate_label = f"{round(duty_pct * 100, 1)}%"

    if ("TamilNadu" in tariff_zone or "TNEB" in scheme.get("board_code", "") or "TANGEDCO" in scheme.get("board_code", "")) and units <= 100:
        duty_amount = 0.0

    fsa_charge = round(units * scheme.get("fsa_rate_per_kwh", 0.0), 2)
    subtotal = energy_charge + fixed_charge + duty_amount + fsa_charge

    # 3. State Government Subsidies Engine
    subsidy_amount = 0.0
    subsidy_applied = False
    subsidy_name = None

    # Telangana Gruha Jyothi Scheme
    if enable_gruha_jyothi and ("Telangana" in tariff_zone or "TG" in scheme.get("board_code", "")):
        if units <= 200:
            subsidy_applied = True
            subsidy_name = "Telangana Gruha Jyothi Scheme (100% Free Bill ≤ 200 units)"
            subsidy_amount = subtotal
        else:
            subsidy_applied = False

    # Karnataka Gruha Jyothi Scheme
    elif enable_gruha_jyothi and ("Karnataka" in tariff_zone or "BESCOM" in scheme.get("board_code", "")):
        if units <= 200:
            subsidy_applied = True
            subsidy_name = "Karnataka Gruha Jyothi Scheme (Zero Bill ≤ 200 units)"
            subsidy_amount = subtotal

    # Delhi 200 units subsidy
    elif "Delhi" in tariff_zone or "BSES" in scheme.get("board_code", ""):
        if units <= 200:
            subsidy_applied = True
            subsidy_name = "Delhi Govt 200 Units 100% Free Power Subsidy"
            subsidy_amount = subtotal
        elif units <= 400:
            subsidy_applied = True
            subsidy_name = "Delhi Govt 50% Domestic Subsidy (up to ₹800)"
            subsidy_amount = min(800.0, energy_charge * 0.50)

    # Tamil Nadu 100 free units built into slabs (already ₹0 rate for 0-100 slab)
    elif "TamilNadu" in tariff_zone or "TNEB" in scheme.get("board_code", "") or "TANGEDCO" in scheme.get("board_code", ""):
        subsidy_applied = True
        subsidy_name = "Tamil Nadu 100 Units Universal Domestic Free Power"
        if units <= 100:
            subsidy_amount = subtotal

    total_bill = max(0.0, subtotal - subsidy_amount)
    effective_rate = (total_bill / units) if units > 0 else 0.0

    return {
        "tariff_zone": tariff_zone,
        "tariff_name": scheme["name"],
        "state": scheme.get("state", "National"),
        "board_code": scheme.get("board_code", "GEN"),
        "region": scheme.get("region", ""),
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
        "subsidy_name": subsidy_name,
        "subsidy_amount": round(subsidy_amount, 2),
        "total_bill": round(total_bill, 2),
        "effective_rate_per_kwh": round(effective_rate, 2),
        "slab_breakdown": slab_breakdowns
    }

def get_available_tariffs() -> List[Dict[str, Any]]:
    """Returns metadata for all available utility zones."""
    unique_schemes = {}
    for k, v in TARIFF_SCHEMES.items():
        board = v.get("board_code", k)
        if board not in unique_schemes:
            unique_schemes[board] = {
                "id": k,
                "name": v["name"],
                "state": v.get("state", "India"),
                "board_code": board,
                "region": v.get("region", ""),
                "currency_symbol": v["symbol"],
                "fixed_charge": v.get("fixed_charge", 50.0),
            }
    return list(unique_schemes.values())
