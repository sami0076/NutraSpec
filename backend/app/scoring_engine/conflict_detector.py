"""
Conflict Detector
=================

Core comparison logic that takes an ingredient list and a user profile,
then identifies every conflict between the two.

For each ingredient the detector:
    1. Looks up metadata (category, risk_tags) from the ingredient database.
    2. Iterates each risk tag and retrieves potential conflicts from the
       weight matrix.
    3. Checks whether the user's profile actually contains the matching
       profile value (e.g. does the user have "peanuts" in their allergies?).
    4. If a match is found, records a conflict object.

Unknown ingredients (not in the metadata DB) are flagged with a special
"unknown" conflict so the UI can inform the user.
"""

from __future__ import annotations

from app.scoring_engine.ingredient_metadata import get_metadata
from app.scoring_engine.weight_matrix import get_conflicts_for_tag


# ---------------------------------------------------------------------------
# Profile Dimension Keys
# ---------------------------------------------------------------------------
# These must match the keys in the user_profile dict.

PROFILE_DIMENSIONS: dict[str, str] = {
    "allergy": "allergies",
    "dietary_restriction": "dietary_restrictions",
    "health_condition": "health_conditions",
    "health_goal": "health_goals",
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def detect_conflicts(
    ingredients: list[str],
    user_profile: dict,
) -> list[dict]:
    """
    Compare a list of ingredients against a user profile and return all
    detected conflicts.

    Args:
        ingredients:  List of ingredient name strings
                      (e.g. ``["maltodextrin", "peanuts", "soy lecithin"]``).
        user_profile: Dict with keys ``allergies``, ``dietary_restrictions``,
                      ``health_conditions``, ``health_goals`` — each a list
                      of lowercase strings.

    Returns:
        A list of conflict dicts, each containing::

            {
                "ingredient":    str,   # original ingredient name
                "conflict_type": str,   # allergy | dietary_restriction | …
                "profile_value": str,   # the specific value that conflicted
                "tag":           str,   # the risk_tag that triggered it
                "weight":        float, # severity weight from weight matrix
                "label":         str,   # human-readable explanation
            }

        Unknown ingredients produce a conflict with
        ``conflict_type = "unknown"``, ``weight = 0.0``.
    """
    profile = _normalize_profile(user_profile)
    conflicts: list[dict] = []

    for ingredient in ingredients:
        normalized = ingredient.strip().lower()
        metadata = get_metadata(normalized)

        if metadata is None:
            conflicts.append(_unknown_conflict(ingredient))
            continue

        for tag in metadata.get("risk_tags", []):
            potential_conflicts = get_conflicts_for_tag(tag)

            for conflict in potential_conflicts:
                if _profile_contains(
                    profile,
                    conflict["conflict_type"],
                    conflict["profile_value"],
                ):
                    conflicts.append({
                        "ingredient": ingredient,
                        "conflict_type": conflict["conflict_type"],
                        "profile_value": conflict["profile_value"],
                        "tag": tag,
                        "weight": conflict["weight"],
                        "label": conflict["label"],
                    })

    return conflicts


def get_flagged_ingredients(conflicts: list[dict]) -> set[str]:
    """
    Return the set of ingredient names that have at least one real conflict
    (excludes "unknown" type).
    """
    return {
        c["ingredient"]
        for c in conflicts
        if c["conflict_type"] != "unknown"
    }


# ---------------------------------------------------------------------------
# Internal Helpers
# ---------------------------------------------------------------------------

def _normalize_profile(user_profile: dict) -> dict[str, set[str]]:
    """
    Normalize user profile values to lowercase sets for O(1) lookup.

    Missing keys default to empty sets so the detector never raises KeyError.
    """
    normalized: dict[str, set[str]] = {}

    for conflict_type, profile_key in PROFILE_DIMENSIONS.items():
        raw_values = user_profile.get(profile_key, [])
        normalized[conflict_type] = {v.strip().lower() for v in raw_values}

    return normalized


def _profile_contains(
    profile: dict[str, set[str]],
    conflict_type: str,
    profile_value: str,
) -> bool:
    """
    Check whether the normalized profile contains the given value under
    the specified conflict type dimension.
    """
    values = profile.get(conflict_type, set())
    return profile_value.strip().lower() in values


def _unknown_conflict(ingredient: str) -> dict:
    """
    Build a placeholder conflict for an ingredient not found in the
    metadata database.
    """
    return {
        "ingredient": ingredient,
        "conflict_type": "unknown",
        "profile_value": "",
        "tag": "",
        "weight": 0.0,
        "label": f"'{ingredient}' is not in our ingredient database",
    }
