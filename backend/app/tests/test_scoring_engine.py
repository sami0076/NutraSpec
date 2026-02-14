"""
Test Scoring Engine — Full Pipeline
====================================

End-to-end tests that call ``analyze()`` with various ingredient lists
and user profiles, then verify the complete structured output.
"""

import pytest

from app.scoring_engine.engine import analyze


# ---------------------------------------------------------------------------
# Fixtures — Reusable profiles and ingredient lists
# ---------------------------------------------------------------------------

@pytest.fixture
def full_profile():
    """A user with allergies, restrictions, conditions, and goals."""
    return {
        "allergies": ["peanuts", "shellfish"],
        "dietary_restrictions": ["vegan"],
        "health_conditions": ["diabetes", "hypertension"],
        "health_goals": ["weight_loss", "clean_eating"],
    }


@pytest.fixture
def allergy_only_profile():
    """A user who only has allergies declared."""
    return {
        "allergies": ["milk", "eggs"],
        "dietary_restrictions": [],
        "health_conditions": [],
        "health_goals": [],
    }


@pytest.fixture
def empty_profile():
    """A user with no declared preferences — should produce zero conflicts."""
    return {
        "allergies": [],
        "dietary_restrictions": [],
        "health_conditions": [],
        "health_goals": [],
    }


# ---------------------------------------------------------------------------
# Tests — Output Structure
# ---------------------------------------------------------------------------

class TestOutputStructure:
    """Verify the shape of the response dict."""

    def test_response_has_required_keys(self, empty_profile):
        result = analyze(["water", "rice"], empty_profile)
        expected_keys = {
            "score",
            "risk_classification",
            "flagged_ingredients",
            "unknown_ingredients",
            "summary",
            "total_ingredients",
            "conflict_count",
        }
        assert expected_keys == set(result.keys())

    def test_score_is_integer(self, empty_profile):
        result = analyze(["water"], empty_profile)
        assert isinstance(result["score"], int)

    def test_score_within_range(self, full_profile):
        result = analyze(["peanuts", "sugar", "maltodextrin"], full_profile)
        assert 0 <= result["score"] <= 100

    def test_risk_classification_is_valid_tier(self, full_profile):
        result = analyze(["water"], full_profile)
        assert result["risk_classification"] in {
            "Low Risk", "Medium Risk", "High Risk",
        }


# ---------------------------------------------------------------------------
# Tests — Clean Products (No Conflicts)
# ---------------------------------------------------------------------------

class TestCleanProducts:
    """Products with no flagged ingredients should score perfectly."""

    def test_all_safe_ingredients(self, empty_profile):
        result = analyze(["water", "rice", "olive oil"], empty_profile)
        assert result["score"] == 100
        assert result["risk_classification"] == "Low Risk"
        assert result["conflict_count"] == 0
        assert len(result["flagged_ingredients"]) == 0

    def test_safe_with_full_profile_but_no_conflicts(self):
        """Known ingredients that don't conflict with the user's profile."""
        profile = {
            "allergies": ["shellfish"],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": [],
        }
        result = analyze(["water", "rice", "citric acid"], profile)
        assert result["score"] == 100
        assert result["risk_classification"] == "Low Risk"


# ---------------------------------------------------------------------------
# Tests — Allergy Detection
# ---------------------------------------------------------------------------

class TestAllergyDetection:
    """Allergen conflicts should produce large score penalties."""

    def test_single_allergen_drops_score(self, allergy_only_profile):
        result = analyze(["milk", "water"], allergy_only_profile)
        assert result["score"] < 100
        assert result["conflict_count"] >= 1
        flagged_names = [f["ingredient"] for f in result["flagged_ingredients"]]
        assert "milk" in flagged_names

    def test_multiple_allergens(self, allergy_only_profile):
        result = analyze(["milk", "eggs", "rice"], allergy_only_profile)
        flagged_names = [f["ingredient"] for f in result["flagged_ingredients"]]
        assert "milk" in flagged_names
        assert "eggs" in flagged_names

    def test_allergen_produces_high_severity(self, allergy_only_profile):
        result = analyze(["milk"], allergy_only_profile)
        milk_entry = result["flagged_ingredients"][0]
        assert milk_entry["severity"] >= 0.7
        assert milk_entry["risk_level"] == "High Risk"


# ---------------------------------------------------------------------------
# Tests — Dietary Restriction Violations
# ---------------------------------------------------------------------------

class TestDietaryRestrictions:
    """Ingredients violating dietary restrictions should be flagged."""

    def test_vegan_animal_derived(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": ["vegan"],
            "health_conditions": [],
            "health_goals": [],
        }
        result = analyze(["gelatin", "water"], profile)
        flagged_names = [f["ingredient"] for f in result["flagged_ingredients"]]
        assert "gelatin" in flagged_names

    def test_gluten_free_violation(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": ["gluten_free"],
            "health_conditions": [],
            "health_goals": [],
        }
        result = analyze(["wheat flour", "rice"], profile)
        flagged_names = [f["ingredient"] for f in result["flagged_ingredients"]]
        assert "wheat flour" in flagged_names


# ---------------------------------------------------------------------------
# Tests — Health Condition Conflicts
# ---------------------------------------------------------------------------

class TestHealthConditions:
    """Ingredients conflicting with health conditions should be flagged."""

    def test_diabetes_high_sugar(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": ["diabetes"],
            "health_goals": [],
        }
        result = analyze(["high fructose corn syrup", "water"], profile)
        flagged_names = [f["ingredient"] for f in result["flagged_ingredients"]]
        assert "high fructose corn syrup" in flagged_names

    def test_hypertension_high_sodium(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": ["hypertension"],
            "health_goals": [],
        }
        result = analyze(["monosodium glutamate", "rice"], profile)
        flagged_names = [f["ingredient"] for f in result["flagged_ingredients"]]
        assert "monosodium glutamate" in flagged_names

    def test_heart_disease_trans_fat(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": ["heart_disease"],
            "health_goals": [],
        }
        result = analyze(["hydrogenated oil", "water"], profile)
        flagged_names = [f["ingredient"] for f in result["flagged_ingredients"]]
        assert "hydrogenated oil" in flagged_names


# ---------------------------------------------------------------------------
# Tests — Health Goal Misalignments
# ---------------------------------------------------------------------------

class TestHealthGoals:
    """Ingredients misaligned with health goals should be mildly flagged."""

    def test_weight_loss_high_calorie(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": ["weight_loss"],
        }
        result = analyze(["sugar", "water"], profile)
        flagged_names = [f["ingredient"] for f in result["flagged_ingredients"]]
        assert "sugar" in flagged_names

    def test_clean_eating_artificial(self):
        profile = {
            "allergies": [],
            "dietary_restrictions": [],
            "health_conditions": [],
            "health_goals": ["clean_eating"],
        }
        result = analyze(["red 40", "aspartame", "water"], profile)
        flagged_names = [f["ingredient"] for f in result["flagged_ingredients"]]
        assert "red 40" in flagged_names
        assert "aspartame" in flagged_names


# ---------------------------------------------------------------------------
# Tests — Score Tier Boundaries
# ---------------------------------------------------------------------------

class TestScoreTierBoundaries:
    """Verify score-to-tier mapping at the threshold edges."""

    def test_score_70_is_low_risk(self, empty_profile):
        """A score of exactly 70 should be Low Risk."""
        from app.scoring_engine.risk_calculator import classify_score
        assert classify_score(70) == "Low Risk"

    def test_score_69_is_medium_risk(self, empty_profile):
        """A score of 69 should be Medium Risk."""
        from app.scoring_engine.risk_calculator import classify_score
        assert classify_score(69) == "Medium Risk"

    def test_score_40_is_medium_risk(self, empty_profile):
        """A score of exactly 40 should be Medium Risk."""
        from app.scoring_engine.risk_calculator import classify_score
        assert classify_score(40) == "Medium Risk"

    def test_score_39_is_high_risk(self, empty_profile):
        """A score of 39 should be High Risk."""
        from app.scoring_engine.risk_calculator import classify_score
        assert classify_score(39) == "High Risk"

    def test_score_100_is_low_risk(self, empty_profile):
        from app.scoring_engine.risk_calculator import classify_score
        assert classify_score(100) == "Low Risk"

    def test_score_0_is_high_risk(self, empty_profile):
        from app.scoring_engine.risk_calculator import classify_score
        assert classify_score(0) == "High Risk"


# ---------------------------------------------------------------------------
# Tests — Unknown Ingredients
# ---------------------------------------------------------------------------

class TestUnknownIngredients:
    """Ingredients not in the DB should appear in unknown_ingredients."""

    def test_unknown_ingredient_listed(self, empty_profile):
        result = analyze(["xylophonic acid", "water"], empty_profile)
        assert "xylophonic acid" in result["unknown_ingredients"]

    def test_unknown_does_not_affect_score(self, empty_profile):
        result = analyze(["xylophonic acid"], empty_profile)
        assert result["score"] == 100
        assert result["conflict_count"] == 0

    def test_all_unknown(self, empty_profile):
        result = analyze(["fakestuff", "nothingreal"], empty_profile)
        assert len(result["unknown_ingredients"]) == 2
        assert result["score"] == 100


# ---------------------------------------------------------------------------
# Tests — Heavily Conflicting Products
# ---------------------------------------------------------------------------

class TestHeavilyConflicting:
    """Products loaded with conflicts should score very low."""

    def test_worst_case_scenario(self, full_profile):
        """Allergens + dietary + conditions + goals all triggered."""
        ingredients = [
            "peanuts",              # allergen (peanut)
            "shrimp",               # allergen (shellfish) + animal_derived (vegan)
            "high fructose corn syrup",  # high_sugar (diabetes) + high_calorie (weight_loss)
            "salt",                 # high_sodium (hypertension)
            "red 40",              # artificial (clean_eating)
        ]
        result = analyze(ingredients, full_profile)
        assert result["score"] < 40
        assert result["risk_classification"] == "High Risk"
        assert result["conflict_count"] > 5


# ---------------------------------------------------------------------------
# Tests — Input Validation
# ---------------------------------------------------------------------------

class TestInputValidation:
    """Verify the engine rejects bad inputs gracefully."""

    def test_empty_ingredients_raises(self, empty_profile):
        with pytest.raises(ValueError):
            analyze([], empty_profile)

    def test_non_list_ingredients_raises(self, empty_profile):
        with pytest.raises(ValueError):
            analyze("peanuts", empty_profile)

    def test_non_dict_profile_raises(self):
        with pytest.raises(TypeError):
            analyze(["water"], "not a dict")

    def test_missing_profile_keys_default_to_empty(self):
        """Profile with missing keys should still work (default to [])."""
        result = analyze(["water"], {})
        assert result["score"] == 100

    def test_whitespace_ingredient_stripped(self, empty_profile):
        result = analyze(["  water  ", "  rice  "], empty_profile)
        assert result["total_ingredients"] == 2
        assert result["score"] == 100


# ---------------------------------------------------------------------------
# Tests — Summary Text
# ---------------------------------------------------------------------------

class TestSummaryText:
    """Verify the summary field is a non-empty string."""

    def test_summary_is_string(self, full_profile):
        result = analyze(["peanuts", "water"], full_profile)
        assert isinstance(result["summary"], str)
        assert len(result["summary"]) > 0

    def test_clean_summary(self, empty_profile):
        result = analyze(["water", "rice"], empty_profile)
        assert "compatible" in result["summary"].lower()
