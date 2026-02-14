"""
Ingredient Metadata Database
============================

Static dictionary mapping ingredient names to structured metadata used by the
scoring engine's conflict detector and weight matrix.

Each entry contains:
    - category:    broad classification (e.g. "allergen", "sweetener", "oil")
    - risk_tags:   list of tags consumed by the conflict detector
    - description: short human-readable explanation

Designed to be easily extensible — add new entries to INGREDIENT_DB as needed.
"""

from typing import Optional


# ---------------------------------------------------------------------------
# Ingredient Database
# ---------------------------------------------------------------------------
# Keys are normalized (lowercase, stripped) ingredient names.
#
# Tag naming conventions:
#   allergen_*         – maps to user allergies
#   animal_derived     – conflicts with vegan / vegetarian
#   contains_gluten    – conflicts with gluten_free
#   contains_dairy     – conflicts with dairy_free / vegan
#   high_glycemic      – conflicts with diabetes
#   high_sodium        – conflicts with hypertension
#   high_sugar         – conflicts with diabetes, weight_loss
#   high_saturated_fat – conflicts with heart_disease
#   high_cholesterol   – conflicts with heart_disease
#   high_calorie       – conflicts with weight_loss
#   trans_fat          – conflicts with heart_disease
#   inflammatory       – conflicts with autoimmune, heart_health
#   artificial_*       – conflicts with clean_eating
#   processed          – conflicts with clean_eating
#   preservative       – informational tag
# ---------------------------------------------------------------------------

INGREDIENT_DB: dict[str, dict] = {

    # ── Major Allergens ────────────────────────────────────────────────────

    "peanuts": {
        "category": "allergen",
        "risk_tags": ["allergen_peanut"],
        "description": "Common allergen; found in many snack foods and sauces.",
    },
    "peanut butter": {
        "category": "allergen",
        "risk_tags": ["allergen_peanut", "high_calorie"],
        "description": "Peanut-derived spread; carries peanut allergy risk.",
    },
    "peanut oil": {
        "category": "oil",
        "risk_tags": ["allergen_peanut", "high_fat"],
        "description": "Oil derived from peanuts; may trigger peanut allergies.",
    },
    "almonds": {
        "category": "allergen",
        "risk_tags": ["allergen_tree_nut"],
        "description": "Tree nut; common allergen.",
    },
    "cashews": {
        "category": "allergen",
        "risk_tags": ["allergen_tree_nut"],
        "description": "Tree nut; common allergen.",
    },
    "walnuts": {
        "category": "allergen",
        "risk_tags": ["allergen_tree_nut"],
        "description": "Tree nut; common allergen.",
    },
    "pecans": {
        "category": "allergen",
        "risk_tags": ["allergen_tree_nut"],
        "description": "Tree nut; common allergen.",
    },
    "milk": {
        "category": "dairy",
        "risk_tags": ["allergen_milk", "animal_derived", "contains_dairy"],
        "description": "Dairy product; common allergen.",
    },
    "whey": {
        "category": "dairy",
        "risk_tags": ["allergen_milk", "animal_derived", "contains_dairy"],
        "description": "Milk-derived protein; common in supplements and baked goods.",
    },
    "casein": {
        "category": "dairy",
        "risk_tags": ["allergen_milk", "animal_derived", "contains_dairy"],
        "description": "Milk protein; found in many processed foods and cheeses.",
    },
    "lactose": {
        "category": "dairy",
        "risk_tags": ["allergen_milk", "contains_dairy"],
        "description": "Milk sugar; problematic for lactose-intolerant individuals.",
    },
    "eggs": {
        "category": "allergen",
        "risk_tags": ["allergen_egg", "animal_derived"],
        "description": "Common allergen; found in baked goods, sauces, and pastas.",
    },
    "egg whites": {
        "category": "allergen",
        "risk_tags": ["allergen_egg", "animal_derived"],
        "description": "Egg-derived ingredient; still carries allergen risk.",
    },
    "wheat": {
        "category": "grain",
        "risk_tags": ["allergen_wheat", "contains_gluten", "high_glycemic"],
        "description": "Contains gluten; common allergen.",
    },
    "wheat flour": {
        "category": "grain",
        "risk_tags": ["allergen_wheat", "contains_gluten", "high_glycemic"],
        "description": "Refined wheat; contains gluten and spikes blood sugar.",
    },
    "soy lecithin": {
        "category": "emulsifier",
        "risk_tags": ["allergen_soy"],
        "description": "Soy-derived emulsifier; ubiquitous in processed foods.",
    },
    "soybean oil": {
        "category": "oil",
        "risk_tags": ["allergen_soy", "inflammatory", "high_fat"],
        "description": "Soy-derived oil; highly processed and inflammatory.",
    },
    "soy protein": {
        "category": "protein",
        "risk_tags": ["allergen_soy"],
        "description": "Soy-derived protein isolate.",
    },
    "shrimp": {
        "category": "allergen",
        "risk_tags": ["allergen_shellfish", "animal_derived"],
        "description": "Shellfish; major allergen.",
    },
    "crab": {
        "category": "allergen",
        "risk_tags": ["allergen_shellfish", "animal_derived"],
        "description": "Shellfish; major allergen.",
    },
    "lobster": {
        "category": "allergen",
        "risk_tags": ["allergen_shellfish", "animal_derived"],
        "description": "Shellfish; major allergen.",
    },
    "anchovy": {
        "category": "allergen",
        "risk_tags": ["allergen_fish", "animal_derived"],
        "description": "Fish product; common hidden allergen in sauces.",
    },
    "fish oil": {
        "category": "oil",
        "risk_tags": ["allergen_fish", "animal_derived"],
        "description": "Oil derived from fish; allergen risk.",
    },
    "sesame": {
        "category": "allergen",
        "risk_tags": ["allergen_sesame"],
        "description": "Sesame seed; recognized major allergen.",
    },
    "sesame oil": {
        "category": "oil",
        "risk_tags": ["allergen_sesame"],
        "description": "Oil derived from sesame seeds.",
    },

    # ── Sweeteners & Sugars ────────────────────────────────────────────────

    "sugar": {
        "category": "sweetener",
        "risk_tags": ["high_sugar", "high_glycemic", "high_calorie"],
        "description": "Refined sugar; spikes blood glucose.",
    },
    "high fructose corn syrup": {
        "category": "sweetener",
        "risk_tags": ["high_sugar", "high_glycemic", "high_calorie", "processed"],
        "description": "Highly processed sweetener linked to obesity and metabolic issues.",
    },
    "corn syrup": {
        "category": "sweetener",
        "risk_tags": ["high_sugar", "high_glycemic", "high_calorie", "processed"],
        "description": "Processed sugar; raises blood glucose quickly.",
    },
    "aspartame": {
        "category": "artificial_sweetener",
        "risk_tags": ["artificial_sweetener", "artificial_additive"],
        "description": "Artificial sweetener; controversial health profile.",
    },
    "sucralose": {
        "category": "artificial_sweetener",
        "risk_tags": ["artificial_sweetener", "artificial_additive"],
        "description": "Artificial sweetener (Splenda); zero-calorie but synthetic.",
    },
    "acesulfame potassium": {
        "category": "artificial_sweetener",
        "risk_tags": ["artificial_sweetener", "artificial_additive"],
        "description": "Artificial sweetener (Ace-K); often combined with other sweeteners.",
    },
    "stevia": {
        "category": "sweetener",
        "risk_tags": [],
        "description": "Natural zero-calorie sweetener derived from the stevia plant.",
    },
    "honey": {
        "category": "sweetener",
        "risk_tags": ["animal_derived", "high_sugar", "high_glycemic"],
        "description": "Bee-produced sweetener; not suitable for strict vegans.",
    },

    # ── Oils & Fats ────────────────────────────────────────────────────────

    "palm oil": {
        "category": "oil",
        "risk_tags": ["high_saturated_fat", "inflammatory"],
        "description": "High in saturated fat; associated with inflammation.",
    },
    "hydrogenated oil": {
        "category": "oil",
        "risk_tags": ["trans_fat", "high_saturated_fat", "inflammatory", "processed"],
        "description": "Contains trans fats; strongly linked to heart disease.",
    },
    "partially hydrogenated oil": {
        "category": "oil",
        "risk_tags": ["trans_fat", "high_saturated_fat", "inflammatory", "processed"],
        "description": "Primary dietary source of artificial trans fats.",
    },
    "canola oil": {
        "category": "oil",
        "risk_tags": ["processed", "inflammatory"],
        "description": "Highly processed seed oil; mildly inflammatory.",
    },
    "lard": {
        "category": "fat",
        "risk_tags": ["animal_derived", "high_saturated_fat", "high_calorie"],
        "description": "Rendered pig fat; animal-derived and high in saturated fat.",
    },
    "butter": {
        "category": "dairy",
        "risk_tags": [
            "animal_derived", "contains_dairy", "allergen_milk", "high_saturated_fat",
        ],
        "description": "Dairy fat; contains milk proteins.",
    },
    "beef tallow": {
        "category": "fat",
        "risk_tags": ["animal_derived", "high_saturated_fat", "high_cholesterol"],
        "description": "Rendered beef fat; high in saturated fat and cholesterol.",
    },
    "chicken fat": {
        "category": "fat",
        "risk_tags": ["animal_derived", "high_saturated_fat"],
        "description": "Rendered poultry fat.",
    },
    "coconut oil": {
        "category": "oil",
        "risk_tags": ["high_saturated_fat"],
        "description": "High in saturated fat but plant-derived.",
    },
    "olive oil": {
        "category": "oil",
        "risk_tags": [],
        "description": "Heart-healthy monounsaturated oil.",
    },

    # ── Additives & Preservatives ──────────────────────────────────────────

    "maltodextrin": {
        "category": "additive",
        "risk_tags": ["high_glycemic", "processed", "high_sugar"],
        "description": "Highly processed carbohydrate; spikes blood sugar rapidly.",
    },
    "monosodium glutamate": {
        "category": "flavor_enhancer",
        "risk_tags": ["artificial_additive", "high_sodium"],
        "description": "MSG; flavor enhancer with high sodium content.",
    },
    "msg": {
        "category": "flavor_enhancer",
        "risk_tags": ["artificial_additive", "high_sodium"],
        "description": "Monosodium glutamate; flavor enhancer.",
    },
    "sodium nitrite": {
        "category": "preservative",
        "risk_tags": ["preservative", "processed", "high_sodium"],
        "description": "Preservative used in cured meats; potential carcinogen.",
    },
    "sodium benzoate": {
        "category": "preservative",
        "risk_tags": ["preservative", "artificial_additive"],
        "description": "Chemical preservative; may form benzene with vitamin C.",
    },
    "potassium sorbate": {
        "category": "preservative",
        "risk_tags": ["preservative"],
        "description": "Common preservative; generally regarded as safe.",
    },
    "bha": {
        "category": "preservative",
        "risk_tags": ["preservative", "artificial_additive", "processed"],
        "description": "Butylated hydroxyanisole; synthetic antioxidant preservative.",
    },
    "bht": {
        "category": "preservative",
        "risk_tags": ["preservative", "artificial_additive", "processed"],
        "description": "Butylated hydroxytoluene; synthetic preservative.",
    },
    "tbhq": {
        "category": "preservative",
        "risk_tags": ["preservative", "artificial_additive", "processed"],
        "description": "Tert-butylhydroquinone; synthetic antioxidant in fried foods.",
    },
    "carrageenan": {
        "category": "thickener",
        "risk_tags": ["inflammatory", "processed"],
        "description": "Seaweed-derived thickener; linked to gut inflammation.",
    },
    "polysorbate 80": {
        "category": "emulsifier",
        "risk_tags": ["artificial_additive", "processed", "inflammatory"],
        "description": "Synthetic emulsifier; may disrupt gut microbiome.",
    },
    "xanthan gum": {
        "category": "thickener",
        "risk_tags": [],
        "description": "Common thickener; generally well tolerated.",
    },

    # ── Artificial Colors ──────────────────────────────────────────────────

    "red 40": {
        "category": "artificial_color",
        "risk_tags": ["artificial_color", "artificial_additive"],
        "description": "Synthetic food dye; linked to hyperactivity in children.",
    },
    "yellow 5": {
        "category": "artificial_color",
        "risk_tags": ["artificial_color", "artificial_additive"],
        "description": "Tartrazine; synthetic dye and potential allergen.",
    },
    "yellow 6": {
        "category": "artificial_color",
        "risk_tags": ["artificial_color", "artificial_additive"],
        "description": "Sunset yellow; synthetic food coloring.",
    },
    "blue 1": {
        "category": "artificial_color",
        "risk_tags": ["artificial_color", "artificial_additive"],
        "description": "Brilliant blue; synthetic food coloring.",
    },
    "caramel color": {
        "category": "coloring",
        "risk_tags": ["artificial_additive", "processed"],
        "description": "Processed coloring agent; may contain 4-MEI.",
    },

    # ── Animal-Derived (non-allergen) ──────────────────────────────────────

    "gelatin": {
        "category": "animal_product",
        "risk_tags": ["animal_derived"],
        "description": "Derived from animal collagen; not suitable for vegans/vegetarians.",
    },

    # ── Sodium-Heavy ───────────────────────────────────────────────────────

    "salt": {
        "category": "mineral",
        "risk_tags": ["high_sodium"],
        "description": "Sodium chloride; excessive intake linked to hypertension.",
    },
    "sodium phosphate": {
        "category": "additive",
        "risk_tags": ["high_sodium", "processed"],
        "description": "Sodium-based additive; emulsifier and leavening agent.",
    },

    # ── Generally Safe / Neutral ───────────────────────────────────────────

    "water": {
        "category": "base",
        "risk_tags": [],
        "description": "Water; no risk.",
    },
    "rice": {
        "category": "grain",
        "risk_tags": [],
        "description": "Naturally gluten-free grain.",
    },
    "oats": {
        "category": "grain",
        "risk_tags": ["contains_gluten"],
        "description": "Whole grain; may contain gluten from cross-contamination.",
    },
    "citric acid": {
        "category": "preservative",
        "risk_tags": [],
        "description": "Naturally occurring acid; generally safe food additive.",
    },
    "vitamin c": {
        "category": "vitamin",
        "risk_tags": [],
        "description": "Ascorbic acid; essential nutrient.",
    },
    "vitamin d": {
        "category": "vitamin",
        "risk_tags": [],
        "description": "Essential vitamin; often added to fortified foods.",
    },
    "iron": {
        "category": "mineral",
        "risk_tags": [],
        "description": "Essential mineral; commonly added to fortified cereals.",
    },
}


# ---------------------------------------------------------------------------
# Lookup Helpers
# ---------------------------------------------------------------------------

def _normalize(name: str) -> str:
    """Normalize an ingredient name for consistent DB lookups."""
    return name.strip().lower()


def get_metadata(ingredient: str) -> Optional[dict]:
    """
    Look up metadata for a given ingredient name.

    Performs a case-insensitive, whitespace-stripped lookup against the
    ingredient database.

    Args:
        ingredient: Raw ingredient name string.

    Returns:
        A dict with keys ``category``, ``risk_tags``, ``description`` — or
        ``None`` if the ingredient is not in the database.
    """
    return INGREDIENT_DB.get(_normalize(ingredient))


def get_all_ingredients() -> list[str]:
    """Return a sorted list of all known ingredient names."""
    return sorted(INGREDIENT_DB.keys())


def is_known(ingredient: str) -> bool:
    """Return True if the ingredient exists in the database."""
    return _normalize(ingredient) in INGREDIENT_DB
