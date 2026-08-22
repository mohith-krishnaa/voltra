"""
Tests for Tariff Engine & Progressive Slab Calculation
"""

import pytest
from backend.tariff import calculate_bill_from_units, get_available_tariffs, TARIFF_SCHEMES

def test_zero_units_bill():
    """Testing bill calculation for 0 units consumption."""
    res = calculate_bill_from_units(0, "Tiered-Standard")
    assert res["total_units"] == 0.0
    assert res["energy_charge"] == 0.0
    # Fixed charge: 60, Duty: 5% of 60 = 3 -> Total = 63.0
    assert res["fixed_charge"] == 60.0
    assert res["duty_amount"] == 3.0
    assert res["total_bill"] == 63.0

def test_slab_boundary_100_units():
    """Testing exact boundary at 100 units in Tiered-Standard."""
    # 0-100 @ 2.50 = 250.0 + Fixed 60 = 310.0 + 5% duty (15.5) = 325.5
    res = calculate_bill_from_units(100, "Tiered-Standard")
    assert res["energy_charge"] == 250.0
    assert res["fixed_charge"] == 60.0
    assert res["duty_amount"] == 15.5
    assert res["total_bill"] == 325.5

def test_multi_slab_250_units():
    """Testing calculation spanning across 3 tiers (0-100, 101-200, 201-250)."""
    # Tier 1 (100 u @ 2.5) = 250
    # Tier 2 (100 u @ 4.25) = 425
    # Tier 3 (50 u @ 6.50) = 325
    # Energy charge = 250 + 425 + 325 = 1000.0
    # Fixed charge = 60.0 -> Subtotal = 1060.0
    # 5% Duty = 53.0 -> Total = 1113.0
    res = calculate_bill_from_units(250, "Tiered-Standard")
    assert res["energy_charge"] == 1000.0
    assert res["fixed_charge"] == 60.0
    assert res["duty_amount"] == 53.0
    assert res["total_bill"] == 1113.0

def test_tneb_free_subsidy():
    """Testing TNEB scheme where first 100 units are free."""
    # 80 units in TNEB -> Energy = 0, Fixed = 50, Duty = 5% of 50 = 2.5 -> Total = 52.5
    res = calculate_bill_from_units(80, "TNEB-Urban")
    assert res["energy_charge"] == 0.0
    assert res["total_bill"] == 52.5

def test_available_tariffs():
    tariffs = get_available_tariffs()
    assert len(tariffs) >= 4
    zone_ids = [t["id"] for t in tariffs]
    assert "Tiered-Standard" in zone_ids
    assert "BESCOM-City" in zone_ids

@pytest.mark.parametrize(("units", "expected_energy", "category"), [
    (45, 87.75, "LT-I(A)"),
    (150, 580.0, "LT-I(B)(i)"),
    (280, 1636.0, "LT-I(B)(ii)"),
    (850, 6990.0, "LT-I(B)(ii)"),
])
def test_tgspdcl_category_tariffs(units, expected_energy, category):
    result = calculate_bill_from_units(units, "TGSPDCL-Telangana")
    assert result["energy_charge"] == expected_energy
    assert category in result["applied_category"]

def test_gruha_jyothi_only_applies_to_eligible_telangana_usage():
    eligible = calculate_bill_from_units(150, "TGSPDCL-Telangana", enable_gruha_jyothi=True)
    non_telanganan = calculate_bill_from_units(150, "BESCOM-City", enable_gruha_jyothi=True)
    over_limit = calculate_bill_from_units(201, "TGSPDCL-Telangana", enable_gruha_jyothi=True)
    assert eligible["total_bill"] == 0.0
    assert eligible["subsidy_applied"] is True
    assert non_telanganan["subsidy_applied"] is False
    assert over_limit["subsidy_applied"] is False
