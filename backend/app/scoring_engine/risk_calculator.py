"""
Risk Calculator

Takes the list of conflicts produced by the conflict detector and computes:

    1. Per-ingredient severity — the highest weight among that ingredient's
       conflicts.
    2. Overall health alignment score (0–100, higher is better) — starts at
       100, subtracts weighted penalties.
    3. Risk classification tier — Low Risk / Medium Risk / High Risk based
       on the final score.

Score formula:
    score = max(0, 100 - sum(weight * base_penalty for each conflict))

Risk tier thresholds:
    >= 70  →  Low Risk
    40–69  →  Medium Risk
    < 40   →  High Risk
"""

from __future__ import annotations

from app.scoring_engine.weight_matrix import get_penalty_points


# Risk Tier Thresholds

LOW_RISK_THRESHOLD = 70
MEDIUM_RISK_THRESHOLD = 40

TIER_LOW = "Low Risk"
TIER_MEDIUM = "Medium Risk"
TIER_HIGH = "High Risk"


# Public API

def calculate_risk(
    conflicts: list[dict],
    total_ingredients: int,
) -> dict:
    """
    Calculate the overall risk score and per-ingredient severities from a
    list of conflicts.

    Args:
        conflicts:         List of conflict dicts produced by
                           ``conflict_detector.detect_conflicts()``.
        total_ingredients: Total number of ingredients being evaluated
                           (used for context, not scoring).

    Returns:
        A dict containing::

            {
                "score":                  int,    # 0–100
                "risk_classification":    str,    # "Low Risk" | "Medium Risk" | "High Risk"
                "ingredient_severities":  dict,   # ingredient_name → highest severity weight
                "total_penalty":          float,  # raw penalty sum (before clamping)
                "total_ingredients":      int,    # echo back for downstream use
                "conflict_count":         int,    # number of real conflicts (excl. unknown)
            }
    """
    # Filter out "unknown" conflicts — they carry 0 weight and are
    # informational only.
    real_conflicts = [c for c in conflicts if c["conflict_type"] != "unknown"]

    # --- Per-ingredient severity (highest weight wins) ---
    ingredient_severities: dict[str, float] = {}
    for conflict in real_conflicts:
        name = conflict["ingredient"]
        weight = conflict["weight"]
        if name not in ingredient_severities or weight > ingredient_severities[name]:
            ingredient_severities[name] = weight

    # --- Total penalty ---
    total_penalty = _compute_total_penalty(real_conflicts)

    # --- Score (clamped 0–100) ---
    score = _clamp(round(100.0 - total_penalty), 0, 100)

    # --- Risk classification ---
    risk_classification = _classify(score)

    return {
        "score": score,
        "risk_classification": risk_classification,
        "ingredient_severities": ingredient_severities,
        "total_penalty": total_penalty,
        "total_ingredients": total_ingredients,
        "conflict_count": len(real_conflicts),
    }


def classify_score(score: int) -> str:
    """
    Standalone helper to classify a numeric score into a risk tier.

    Args:
        score: Integer score in the 0–100 range.

    Returns:
        One of ``"Low Risk"``, ``"Medium Risk"``, or ``"High Risk"``.
    """
    return _classify(score)


# Internal Helpers

def _compute_total_penalty(conflicts: list[dict]) -> float:
    """
    Sum up all weighted penalties.

    For each conflict:
        penalty = weight * base_penalty_points_for_conflict_type

    This means a single allergen hit (weight 1.0 * 40 pts) = 40 point
    deduction, while a mild health-goal conflict (weight 0.3 * 10 pts) = 3
    point deduction.
    """
    total = 0.0
    for conflict in conflicts:
        base_points = get_penalty_points(conflict["conflict_type"])
        total += conflict["weight"] * base_points
    return total


def _classify(score: int) -> str:
    """Map a 0–100 score to a risk tier string."""
    if score >= LOW_RISK_THRESHOLD:
        return TIER_LOW
    if score >= MEDIUM_RISK_THRESHOLD:
        return TIER_MEDIUM
    return TIER_HIGH


def _clamp(value: int, minimum: int, maximum: int) -> int:
    """Clamp an integer between minimum and maximum (inclusive)."""
    return max(minimum, min(maximum, value))
