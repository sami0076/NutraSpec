"""
Test Conflict Detector
=======================

Focused unit tests for the conflict detection layer, verifying that
ingredients are correctly matched against each user-profile dimension.
"""

import pytest

from app.scoring_engine.conflict_detector import (
    detect_conflicts,
    get_flagged_ingredients,
)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def empty_profile():
    return {
        "allergies": [],
        "dietary_restrictions": [],
        "health_conditions": [],
        "health_goals": [],
    }


# ---------------------------------------------------------------------------
# Tests — Allergy Conflicts
# ---------------------------------------------------------------------------

class TestAllergyConflicts:
    """Allergen ingredients should trigger allergy-type conflicts."""

    def test_exact_allergy_match(self):
        profile = {
            "allergies": ["peanuts"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["peanuts"], profile)
        allergy_conflicts = [c for c in conflicts if c["conflict_type"] == "allergy"]
        assert len(allergy_conflicts) >= 1
        assert allergy_conflicts[0]["profile_value"] == "peanuts"

    def test_case_insensitive_allergy(self):
        profile = {
            "allergies": ["Peanuts"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["PEANUTS"], profile)
        allergy_conflicts = [c for c in conflicts if c["conflict_type"] == "allergy"]
        assert len(allergy_conflicts) >= 1

    def test_multiple_allergies_detected(self):
        profile = {
            "allergies": ["peanuts", "milk"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["peanuts", "milk", "water"], profile)
        allergy_conflicts = [c for c in conflicts if c["conflict_type"] == "allergy"]
        flagged = {c["ingredient"].lower() for c in allergy_conflicts}
        assert "peanuts" in flagged
        assert "milk" in flagged

    def test_no_allergy_when_not_in_profile(self):
        profile = {
            "allergies": ["shellfish"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["peanuts"], profile)
        allergy_conflicts = [c for c in conflicts if c["conflict_type"] == "allergy"]
        assert len(allergy_conflicts) == 0

    def test_allergy_weight_is_maximum(self):
        profile = {
            "allergies": ["soy"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["soy lecithin"], profile)
        allergy_conflicts = [c for c in conflicts if c["conflict_type"] == "allergy"]
        assert len(allergy_conflicts) >= 1
        assert allergy_conflicts[0]["weight"] == 1.0

    def test_shellfish_allergy(self):
        profile = {
            "allergies": ["shellfish"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["shrimp", "crab", "water"], profile)
        allergy_conflicts = [c for c in conflicts if c["conflict_type"] == "allergy"]
        flagged = {c["ingredient"].lower() for c in allergy_conflicts}
        assert "shrimp" in flagged
        assert "crab" in flagged

    def test_tree_nut_allergy(self):
        profile = {
            "allergies": ["tree nuts"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["almonds", "cashews"], profile)
        allergy_conflicts = [c for c in conflicts if c["conflict_type"] == "allergy"]
        assert len(allergy_conflicts) >= 2


# ---------------------------------------------------------------------------
# Tests — Dietary Restriction Conflicts
# ---------------------------------------------------------------------------

class TestDietaryRestrictionConflicts:
    """Animal-derived and gluten/dairy ingredients should trigger dietary conflicts."""

    def test_vegan_animal_derived(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": ["vegan"],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["gelatin"], profile)
        dietary = [c for c in conflicts if c["conflict_type"] == "dietary_restriction"]
        assert len(dietary) >= 1
        assert dietary[0]["profile_value"] == "vegan"

    def test_vegan_dairy_conflict(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": ["vegan"],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["butter"], profile)
        dietary = [c for c in conflicts if c["conflict_type"] == "dietary_restriction"]
        vegan_conflicts = [c for c in dietary if c["profile_value"] == "vegan"]
        assert len(vegan_conflicts) >= 1

    def test_vegetarian_animal_derived(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": ["vegetarian"],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["lard"], profile)
        dietary = [c for c in conflicts if c["conflict_type"] == "dietary_restriction"]
        assert len(dietary) >= 1
        assert dietary[0]["profile_value"] == "vegetarian"

    def test_gluten_free_conflict(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": ["gluten_free"],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["wheat", "oats"], profile)
        dietary = [c for c in conflicts if c["conflict_type"] == "dietary_restriction"]
        flagged = {c["ingredient"].lower() for c in dietary}
        assert "wheat" in flagged
        assert "oats" in flagged

    def test_dairy_free_conflict(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": ["dairy_free"],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["whey", "casein", "water"], profile)
        dietary = [c for c in conflicts if c["conflict_type"] == "dietary_restriction"]
        flagged = {c["ingredient"].lower() for c in dietary}
        assert "whey" in flagged
        assert "casein" in flagged

    def test_no_dietary_conflict_when_no_restriction(self, empty_profile):
        conflicts = detect_conflicts(["gelatin", "butter"], empty_profile)
        dietary = [c for c in conflicts if c["conflict_type"] == "dietary_restriction"]
        assert len(dietary) == 0


# ---------------------------------------------------------------------------
# Tests — Health Condition Conflicts
# ---------------------------------------------------------------------------

class TestHealthConditionConflicts:
    """Ingredients risky for declared health conditions should be flagged."""

    def test_diabetes_sugar(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": ["diabetes"],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["sugar"], profile)
        condition = [c for c in conflicts if c["conflict_type"] == "health_condition"]
        assert len(condition) >= 1
        assert condition[0]["profile_value"] == "diabetes"

    def test_diabetes_maltodextrin(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": ["diabetes"],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["maltodextrin"], profile)
        condition = [c for c in conflicts if c["conflict_type"] == "health_condition"]
        assert len(condition) >= 1

    def test_hypertension_sodium(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": ["hypertension"],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["salt", "monosodium glutamate"], profile)
        condition = [c for c in conflicts if c["conflict_type"] == "health_condition"]
        flagged = {c["ingredient"].lower() for c in condition}
        assert "salt" in flagged
        assert "monosodium glutamate" in flagged

    def test_heart_disease_trans_fat(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": ["heart_disease"],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["partially hydrogenated oil"], profile)
        condition = [c for c in conflicts if c["conflict_type"] == "health_condition"]
        assert len(condition) >= 1

    def test_autoimmune_inflammatory(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": ["autoimmune"],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["carrageenan"], profile)
        condition = [c for c in conflicts if c["conflict_type"] == "health_condition"]
        assert len(condition) >= 1
        assert condition[0]["profile_value"] == "autoimmune"

    def test_no_condition_conflict_when_healthy(self, empty_profile):
        conflicts = detect_conflicts(["sugar", "salt"], empty_profile)
        condition = [c for c in conflicts if c["conflict_type"] == "health_condition"]
        assert len(condition) == 0


# ---------------------------------------------------------------------------
# Tests — Health Goal Conflicts
# ---------------------------------------------------------------------------

class TestHealthGoalConflicts:
    """Ingredients misaligned with health goals should trigger goal conflicts."""

    def test_weight_loss_high_calorie(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": ["weight_loss"],
        }
        conflicts = detect_conflicts(["sugar"], profile)
        goal = [c for c in conflicts if c["conflict_type"] == "health_goal"]
        assert len(goal) >= 1
        assert goal[0]["profile_value"] == "weight_loss"

    def test_clean_eating_artificial(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": ["clean_eating"],
        }
        conflicts = detect_conflicts(["red 40", "bha"], profile)
        goal = [c for c in conflicts if c["conflict_type"] == "health_goal"]
        flagged = {c["ingredient"].lower() for c in goal}
        assert "red 40" in flagged
        assert "bha" in flagged

    def test_heart_health_goal_sodium(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": ["heart_health"],
        }
        conflicts = detect_conflicts(["salt"], profile)
        goal = [c for c in conflicts if c["conflict_type"] == "health_goal"]
        assert len(goal) >= 1

    def test_no_goal_conflict_when_no_goals(self, empty_profile):
        conflicts = detect_conflicts(["sugar", "red 40"], empty_profile)
        goal = [c for c in conflicts if c["conflict_type"] == "health_goal"]
        assert len(goal) == 0


# ---------------------------------------------------------------------------
# Tests — Unknown / Missing Ingredients
# ---------------------------------------------------------------------------

class TestUnknownIngredients:
    """Ingredients not in the metadata DB should be flagged as unknown."""

    def test_unknown_ingredient_detected(self, empty_profile):
        conflicts = detect_conflicts(["nonexistentium"], empty_profile)
        unknown = [c for c in conflicts if c["conflict_type"] == "unknown"]
        assert len(unknown) == 1
        assert unknown[0]["ingredient"] == "nonexistentium"

    def test_unknown_weight_is_zero(self, empty_profile):
        conflicts = detect_conflicts(["fakefood"], empty_profile)
        unknown = [c for c in conflicts if c["conflict_type"] == "unknown"]
        assert unknown[0]["weight"] == 0.0

    def test_mix_of_known_and_unknown(self):
        profile = {
            "allergies": ["peanuts"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["peanuts", "unknownstuff"], profile)
        allergy = [c for c in conflicts if c["conflict_type"] == "allergy"]
        unknown = [c for c in conflicts if c["conflict_type"] == "unknown"]
        assert len(allergy) >= 1
        assert len(unknown) == 1


# ---------------------------------------------------------------------------
# Tests — get_flagged_ingredients helper
# ---------------------------------------------------------------------------

class TestGetFlaggedIngredients:
    """Verify the helper that extracts flagged ingredient names."""

    def test_excludes_unknown(self, empty_profile):
        conflicts = detect_conflicts(["unknownthing"], empty_profile)
        flagged = get_flagged_ingredients(conflicts)
        assert len(flagged) == 0

    def test_includes_real_conflicts(self):
        profile = {
            "allergies": ["peanuts"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["peanuts", "water"], profile)
        flagged = get_flagged_ingredients(conflicts)
        assert "peanuts" in flagged
        assert "water" not in flagged


# ---------------------------------------------------------------------------
# Tests — Edge Cases
# ---------------------------------------------------------------------------

class TestEdgeCases:
    """Various edge cases the detector should handle gracefully."""

    def test_empty_ingredient_list(self, empty_profile):
        conflicts = detect_conflicts([], empty_profile)
        assert conflicts == []

    def test_whitespace_ingredient_normalized(self):
        profile = {
            "allergies": ["peanuts"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["  peanuts  "], profile)
        allergy = [c for c in conflicts if c["conflict_type"] == "allergy"]
        assert len(allergy) >= 1

    def test_whitespace_profile_values_normalized(self):
        profile = {
            "allergies": ["  Peanuts  "],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["peanuts"], profile)
        allergy = [c for c in conflicts if c["conflict_type"] == "allergy"]
        assert len(allergy) >= 1

    def test_duplicate_ingredients(self):
        profile = {
            "allergies": ["peanuts"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        conflicts = detect_conflicts(["peanuts", "peanuts"], profile)
        allergy = [c for c in conflicts if c["conflict_type"] == "allergy"]
        # Each occurrence should generate its own conflicts
        assert len(allergy) >= 2

    def test_no_conflicts_returns_empty_list(self, empty_profile):
        conflicts = detect_conflicts(["water", "rice"], empty_profile)
        real = [c for c in conflicts if c["conflict_type"] != "unknown"]
        assert real == []
