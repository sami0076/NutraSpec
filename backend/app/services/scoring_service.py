"""
Scoring Service — Wrapper for Deterministic Risk Engine
========================================================

Thin wrapper around the scoring engine. Receives ingredients and user profile,
returns the engine's structured output.

This service does NOT:
- Process images
- Call Gemini
- Use AI or computer vision

It is purely deterministic logic.
"""

from __future__ import annotations

from app.scoring_engine import analyze


# ---------------------------------------------------------------------------
# Profile Keys (must match scoring engine)
# ---------------------------------------------------------------------------

REQUIRED_PROFILE_KEYS = {
    "allergies",
    "dietary_restrictions",
    "health_conditions",
    "health_goals",
}


def _ensure_profile_shape(profile: dict) -> dict:
    """Ensure user_profile has all required keys with list values."""
    result = {}
    for key in REQUIRED_PROFILE_KEYS:
        value = profile.get(key, [])
        if not isinstance(value, list):
            value = []
        result[key] = value
    return result


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def score_ingredients(
    ingredients: list[str],
    user_profile: dict,
) -> dict:
    """
    Run the scoring engine on extracted ingredients and user profile.

    Args:
        ingredients: List of ingredient name strings (e.g. from Gemini extraction).
        user_profile: Dict with keys allergies, dietary_restrictions,
                      health_conditions, health_goals — each a list of strings.
                      Missing keys default to empty lists.

    Returns:
        Structured dict from scoring engine::
            {
                "score": int,
                "risk_classification": str,
                "flagged_ingredients": list,
                "unknown_ingredients": list,
                "summary": str,
                "total_ingredients": int,
                "conflict_count": int,
            }
    """
    cleaned_profile = _ensure_profile_shape(user_profile)
    return analyze(ingredients, cleaned_profile)
