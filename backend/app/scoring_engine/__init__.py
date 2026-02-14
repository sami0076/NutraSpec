"""
Scoring Engine Package

Deterministic ingredient risk scoring engine.

Receives a structured ingredient list and user profile, then returns
a health alignment score (0–100), risk classification (Low / Medium /
High Risk), and per-ingredient conflict explanations.

Public API::

    from app.scoring_engine import analyze

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

from app.scoring_engine.engine import analyze  # noqa: F401

__all__ = ["analyze"]
