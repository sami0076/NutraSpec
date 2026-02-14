"""
Explanation Generator
=====================

Transforms raw conflict data and per-ingredient severities into
human-readable, frontend-ready output:

    - A list of flagged ingredient objects (each with reasons and severity)
    - A plain-English summary sentence

This module does NOT perform any scoring — it only formats the results
produced by the conflict detector and risk calculator.
"""

from __future__ import annotations

from app.scoring_engine.risk_calculator import classify_score


# Severity Label Thresholds

def _severity_label(weight: float) -> str:
    """
    Convert a numeric severity weight to a human-readable risk label.

    Thresholds:
        >= 0.7  →  High Risk
        >= 0.4  →  Medium Risk
        <  0.4  →  Low Risk
    """
    if weight >= 0.7:
        return "High Risk"
    if weight >= 0.4:
        return "Medium Risk"
    return "Low Risk"


# Public API

def generate_explanations(
    conflicts: list[dict],
    ingredient_severities: dict[str, float],
    total_ingredients: int,
) -> dict:
    """
    Build the explanation payload returned to the frontend.

    Args:
        conflicts:              List of conflict dicts from
                                ``conflict_detector.detect_conflicts()``.
        ingredient_severities:  Dict mapping ingredient name → highest
                                severity weight, from
                                ``risk_calculator.calculate_risk()``.
        total_ingredients:      Total number of ingredients analyzed.

    Returns:
        A dict containing::

            {
                "flagged_ingredients": [
                    {
                        "ingredient":  str,
                        "risk_level":  str,    # "Low Risk" | "Medium Risk" | "High Risk"
                        "reasons":     list[str],
                        "severity":    float,  # 0.0–1.0
                    },
                    ...
                ],
                "unknown_ingredients": [str, ...],
                "summary": str,
            }
    """
    flagged = _build_flagged_list(conflicts, ingredient_severities)
    unknowns = _collect_unknowns(conflicts)
    summary = _build_summary(flagged, unknowns, total_ingredients)

    return {
        "flagged_ingredients": flagged,
        "unknown_ingredients": unknowns,
        "summary": summary,
    }


# Internal Helpers

def _build_flagged_list(
    conflicts: list[dict],
    ingredient_severities: dict[str, float],
) -> list[dict]:
    """
    Group conflicts by ingredient and produce a sorted list of flagged
    ingredient objects, ordered by severity (highest first).
    """
    # Group reasons by ingredient
    reasons_map: dict[str, list[str]] = {}
    for conflict in conflicts:
        if conflict["conflict_type"] == "unknown":
            continue
        name = conflict["ingredient"]
        reasons_map.setdefault(name, [])
        label = conflict.get("label", "")
        if label and label not in reasons_map[name]:
            reasons_map[name].append(label)

    # Build flagged list
    flagged: list[dict] = []
    for name, reasons in reasons_map.items():
        severity = ingredient_severities.get(name, 0.0)
        flagged.append({
            "ingredient": name,
            "risk_level": _severity_label(severity),
            "reasons": reasons,
            "severity": round(severity, 2),
        })

    # Sort by severity descending so the worst offenders appear first
    flagged.sort(key=lambda item: item["severity"], reverse=True)
    return flagged


def _collect_unknowns(conflicts: list[dict]) -> list[str]:
    """
    Return a deduplicated list of ingredient names that were not found in
    the metadata database.
    """
    seen: set[str] = set()
    unknowns: list[str] = []
    for conflict in conflicts:
        if conflict["conflict_type"] == "unknown":
            name = conflict["ingredient"]
            if name not in seen:
                seen.add(name)
                unknowns.append(name)
    return unknowns


def _build_summary(
    flagged: list[dict],
    unknowns: list[str],
    total_ingredients: int,
) -> str:
    """
    Build a one- or two-sentence human-readable summary of the analysis.
    """
    if total_ingredients == 0:
        return "No ingredients were provided for analysis."

    flagged_count = len(flagged)
    compatible_count = total_ingredients - flagged_count - len(unknowns)

    # All clear
    if flagged_count == 0 and len(unknowns) == 0:
        return (
            f"All {total_ingredients} ingredient(s) appear compatible "
            f"with your profile."
        )

    # Build main sentence
    parts: list[str] = []

    if compatible_count > 0:
        parts.append(
            f"{compatible_count} of {total_ingredients} ingredient(s) "
            f"are compatible with your profile."
        )
    else:
        parts.append(
            f"None of the {total_ingredients} ingredient(s) "
            f"are fully compatible with your profile."
        )

    # Append flagged detail
    if flagged_count > 0:
        high_risk = [f for f in flagged if f["risk_level"] == "High Risk"]
        if high_risk:
            names = ", ".join(f["ingredient"] for f in high_risk)
            parts.append(f"High risk: {names}.")
        else:
            parts.append(f"{flagged_count} ingredient(s) flagged.")

    # Append unknown detail
    if unknowns:
        parts.append(
            f"{len(unknowns)} ingredient(s) not recognized in our database."
        )

    return " ".join(parts)
