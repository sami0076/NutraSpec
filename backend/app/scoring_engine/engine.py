"""
Scoring Engine — Orchestrator
==============================

Top-level entry point for the ingredient risk scoring pipeline.

The single public function ``analyze()`` coordinates the entire flow:

    1. Validate and normalize inputs.
    2. Detect conflicts between ingredients and user profile.
    3. Calculate the health alignment score and risk classification.
    4. Generate human-readable explanations.
    5. Assemble and return the final structured response.

This module is the only thing external code (e.g. the backend scoring
service) needs to import.

Usage::

    from app.scoring_engine.engine import analyze

    result = analyze(
        ingredients=["maltodextrin", "peanuts", "soy lecithin"],
        user_profile={
            "allergies": ["peanuts"],
            "dietary_restrictions": ["vegan"],
            "health_conditions": ["diabetes"],
            "health_goals": ["weight_loss"],
        },
    )
"""

from __future__ import annotations

from app.scoring_engine.conflict_detector import detect_conflicts
from app.scoring_engine.risk_calculator import calculate_risk
from app.scoring_engine.explanation_generator import generate_explanations


# ---------------------------------------------------------------------------
# Input Validation
# ---------------------------------------------------------------------------

_REQUIRED_PROFILE_KEYS = {
    "allergies",
    "dietary_restrictions",
    "health_conditions",
    "health_goals",
}


def _validate_inputs(
    ingredients: list[str],
    user_profile: dict,
) -> tuple[list[str], dict]:
    """
    Validate and normalize the raw inputs.

    - ``ingredients`` must be a non-empty list of non-empty strings.
    - ``user_profile`` must be a dict.  Missing profile keys are filled
      with empty lists so downstream code never raises KeyError.

    Returns:
        A tuple of (cleaned_ingredients, cleaned_profile).

    Raises:
        ValueError: If ``ingredients`` is not a list or is empty.
        TypeError:  If ``user_profile`` is not a dict.
    """
    # --- Ingredients ---
    if not isinstance(ingredients, list):
        raise ValueError("ingredients must be a list of strings")
    if len(ingredients) == 0:
        raise ValueError("ingredients list must not be empty")

    cleaned_ingredients = [
        item.strip() for item in ingredients if isinstance(item, str) and item.strip()
    ]
    if len(cleaned_ingredients) == 0:
        raise ValueError("ingredients list contained no valid strings")

    # --- User Profile ---
    if not isinstance(user_profile, dict):
        raise TypeError("user_profile must be a dict")

    cleaned_profile: dict = {}
    for key in _REQUIRED_PROFILE_KEYS:
        value = user_profile.get(key, [])
        if not isinstance(value, list):
            value = []
        cleaned_profile[key] = value

    return cleaned_ingredients, cleaned_profile


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def analyze(
    ingredients: list[str],
    user_profile: dict,
) -> dict:
    """
    Run the full ingredient risk scoring pipeline.

    Args:
        ingredients:  List of ingredient name strings extracted by Gemini
                      (e.g. ``["maltodextrin", "peanuts", "soy lecithin"]``).
        user_profile: Dict with keys ``allergies``, ``dietary_restrictions``,
                      ``health_conditions``, ``health_goals`` — each a list
                      of strings.  Missing keys default to empty lists.

    Returns:
        A structured dict::

            {
                "score":                int,      # 0–100, higher is better
                "risk_classification":  str,      # "Low Risk" | "Medium Risk" | "High Risk"
                "flagged_ingredients":  list,     # per-ingredient detail objects
                "unknown_ingredients":  list,     # ingredient names not in DB
                "summary":             str,       # plain-English summary
                "total_ingredients":    int,
                "conflict_count":       int,
            }

    Raises:
        ValueError: If ingredients is invalid.
        TypeError:  If user_profile is not a dict.
    """
    # Step 1 — Validate & normalize
    cleaned_ingredients, cleaned_profile = _validate_inputs(
        ingredients, user_profile,
    )

    total = len(cleaned_ingredients)

    # Step 2 — Detect conflicts
    conflicts = detect_conflicts(cleaned_ingredients, cleaned_profile)

    # Step 3 — Calculate risk score
    risk_result = calculate_risk(conflicts, total)

    # Step 4 — Generate explanations
    explanation_result = generate_explanations(
        conflicts=conflicts,
        ingredient_severities=risk_result["ingredient_severities"],
        total_ingredients=total,
    )

    # Step 5 — Assemble final response
    return {
        "score": risk_result["score"],
        "risk_classification": risk_result["risk_classification"],
        "flagged_ingredients": explanation_result["flagged_ingredients"],
        "unknown_ingredients": explanation_result["unknown_ingredients"],
        "summary": explanation_result["summary"],
        "total_ingredients": total,
        "conflict_count": risk_result["conflict_count"],
    }
