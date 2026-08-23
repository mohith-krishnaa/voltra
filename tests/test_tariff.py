"""
Tests for Tariff Engine & Progressive Slab Calculation
"""

import pytest
from backend.tariff import calculate_bill_from_units, get_available_tariffs, TARIFF_SCHEMES

def test_zero_units_bill():
    """Testing bill calculation for 0 units consumption."""
    res = calculate_bill_from_units(0, "TGSPDCL-Telangana")
    assert res["total_units"] == 0.0
    assert res["energy_charge"] == 0.0
    assert res["fixed_charge"] == 25.0
    assert res["total_bill"] == 25.0

def test_slab_boundary_100_units():
    """Testing exact boundary at 100 units in TGSPDCL LT-I(A)."""
    # 0-50 @ 1.95 (97.5) + 51-100 @ 3.10 (155.0) = 252.5 + Fixed 25 = 277.5 + duty 6.0 = 283.5
    res = calculate_bill_from_units(100, "TGSPDCL-Telangana")
    assert res["energy_charge"] == 252.5
    assert res["fixed_charge"] == 25.0
    assert res["duty_amount"] == 6.0
    assert res["total_bill"] == 283.5

def test_multi_slab_250_units():
    """Testing calculation in TGSPDCL LT-I(B)(ii) spanning across slabs."""
    # 0-200 @ 5.10 (1020) + 201-250 @ 7.70 (385) = 1405.0 + Fixed 80 = 1485.0 + duty 15.0 = 1500.0
    res = calculate_bill_from_units(250, "TGSPDCL-Telangana")
    assert res["energy_charge"] == 1405.0
    assert res["fixed_charge"] == 80.0
    assert res["duty_amount"] == 15.0
    assert res["total_bill"] == 1500.0

def test_tneb_free_subsidy():
    """Testing TNEB scheme where first 100 units are free."""
    res = calculate_bill_from_units(80, "TANGEDCO-TamilNadu")
    assert res["energy_charge"] == 0.0
    assert res["total_bill"] == 0.0

def test_available_tariffs():
    tariffs = get_available_tariffs()
    assert len(tariffs) >= 5
    board_codes = [t["board_code"] for t in tariffs]
    assert "TGSPDCL" in board_codes
    assert "APSPDCL" in board_codes
    assert "BESCOM" in board_codes
    assert "TANGEDCO" in board_codes

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
    over_limit = calculate_bill_from_units(201, "TGSPDCL-Telangana", enable_gruha_jyothi=True)
    assert eligible["total_bill"] == 0.0
    assert eligible["subsidy_applied"] is True
    assert over_limit["subsidy_applied"] is False
