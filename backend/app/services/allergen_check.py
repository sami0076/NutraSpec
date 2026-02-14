"""
Deterministic allergen check — backup for Gemini.

Maps allergy types to ingredient substrings. If any ingredient contains
an allergen keyword, we flag it. Ensures we never miss obvious allergens
like peanut butter when user has peanut allergy.
"""

from __future__ import annotations

from app.core.utils import to_title_case

# Allergy type -> substrings to match in ingredients (lowercase)
ALLERGEN_KEYWORDS: dict[str, list[str]] = {
    "peanuts": ["peanut"],
    "tree_nuts": [
        "almond", "cashew", "walnut", "pecan", "hazelnut", "filbert",
        "macadamia", "pistachio", "brazil nut", "pine nut", "chestnut",
    ],
    "milk": ["milk", "whey", "casein", "lactose", "butter", "cream", "cheese"],
    "eggs": ["egg"],
    "wheat": ["wheat", "gluten"],
    "soy": ["soy", "soybean"],
    "fish": ["fish", "anchovy", "cod", "tuna", "salmon", "sardine", "bass"],
    "shellfish": ["shrimp", "crab", "lobster", "shellfish", "prawn", "crayfish"],
    "sesame": ["sesame"],
    "corn": ["corn"],
    "sulfites": ["sulfite", "sulphite"],
}


def check_allergens(
    ingredients: list[str],
    allergies: list[str],
) -> list[dict]:
    """
    Check ingredients for allergen keywords. Returns list of flagged items.
    Each item: {ingredient, risk_level, reasons, severity}
    """
    if not allergies:
        return []

    ingredients_lower = [i.lower() for i in ingredients if i]
    flagged = []

    for allergy in allergies:
        allergy_lower = allergy.lower().strip().replace(" ", "_")
        keywords = ALLERGEN_KEYWORDS.get(allergy_lower)

        if not keywords:
            # Unknown allergy - use the allergy name itself as keyword
            keywords = [allergy_lower.replace("_", " ")]

        for ing in ingredients_lower:
            for kw in keywords:
                if kw in ing:
                    # Find display form of ingredient
                    display = next(
                        (i for i in ingredients if i.lower() == ing),
                        to_title_case(ing),
                    )
                    flagged.append({
                        "ingredient": display,
                        "risk_level": "High Risk",
                        "reasons": [f"Contains {allergy.replace('_', ' ')} - allergen for your profile"],
                        "severity": 1.0,
                    })
                    break  # Don't flag same ingredient twice for same allergy

    return flagged


def merge_allergen_flags(
    gemini_result: dict,
    deterministic_flags: list[dict],
) -> dict:
    """
    If deterministic check found allergens Gemini missed, override the result.
    """
    if not deterministic_flags:
        return gemini_result

    # Gemini may have flagged some but not all - merge and dedupe by ingredient
    existing = {f.get("ingredient", "").lower() for f in gemini_result.get("flagged_ingredients", [])}
    new_flags = [f for f in deterministic_flags if f.get("ingredient", "").lower() not in existing]

    if not new_flags:
        return gemini_result

    # We found allergens Gemini missed - override to unsafe
    all_flagged = list(gemini_result.get("flagged_ingredients", [])) + new_flags
    return {
        **gemini_result,
        "score": min(gemini_result.get("score", 100), 20),  # Force low score
        "risk_classification": "High Risk",
        "flagged_ingredients": all_flagged,
        "summary": (
            f"Not safe for your allergies. Contains: {', '.join(f['ingredient'] for f in new_flags)}. Avoid this product."
            if new_flags
            else gemini_result.get("summary", "Analysis complete.")
        ),
    }
