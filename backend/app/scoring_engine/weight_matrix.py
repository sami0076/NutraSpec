"""
Weight Matrix

Maps ingredient risk tags to the user-profile dimensions they conflict with
and assigns numeric severity weights (0.0 – 1.0) used by the risk calculator.

Conflict types (profile dimensions):
    allergy              – user-declared allergies
    dietary_restriction   – vegan, vegetarian, keto, gluten_free, dairy_free …
    health_condition      – diabetes, hypertension, heart_disease, autoimmune …
    health_goal           – weight_loss, muscle_gain, heart_health, clean_eating …

Weight scale:
    1.0  = critical (e.g. allergen match)
    0.7+ = severe
    0.5  = moderate
    0.3  = mild
"""


# Tag → Conflict Mapping
# Each risk tag (from ingredient_metadata) maps to a list of potential
# conflicts.  Every conflict specifies:
#     conflict_type  – which profile dimension to check
#     profile_value  – the specific value within that dimension
#     weight         – severity penalty (0.0–1.0)
#     label          – short human-readable reason (used by explanation gen)


TAG_CONFLICT_MAP: dict[str, list[dict]] = {

    # Allergen Tags 
    # Allergen matches are always the highest severity (1.0).

    "allergen_peanut": [
        {
            "conflict_type": "allergy",
            "profile_value": "peanuts",
            "weight": 1.0,
            "label": "Contains peanuts — you have a peanut allergy",
        },
    ],
    "allergen_tree_nut": [
        {
            "conflict_type": "allergy",
            "profile_value": "tree nuts",
            "weight": 1.0,
            "label": "Contains tree nuts — you have a tree nut allergy",
        },
    ],
    "allergen_milk": [
        {
            "conflict_type": "allergy",
            "profile_value": "milk",
            "weight": 1.0,
            "label": "Contains milk — you have a milk/dairy allergy",
        },
    ],
    "allergen_egg": [
        {
            "conflict_type": "allergy",
            "profile_value": "eggs",
            "weight": 1.0,
            "label": "Contains egg — you have an egg allergy",
        },
    ],
    "allergen_wheat": [
        {
            "conflict_type": "allergy",
            "profile_value": "wheat",
            "weight": 1.0,
            "label": "Contains wheat — you have a wheat allergy",
        },
    ],
    "allergen_soy": [
        {
            "conflict_type": "allergy",
            "profile_value": "soy",
            "weight": 1.0,
            "label": "Contains soy — you have a soy allergy",
        },
    ],
    "allergen_shellfish": [
        {
            "conflict_type": "allergy",
            "profile_value": "shellfish",
            "weight": 1.0,
            "label": "Contains shellfish — you have a shellfish allergy",
        },
    ],
    "allergen_fish": [
        {
            "conflict_type": "allergy",
            "profile_value": "fish",
            "weight": 1.0,
            "label": "Contains fish — you have a fish allergy",
        },
    ],
    "allergen_sesame": [
        {
            "conflict_type": "allergy",
            "profile_value": "sesame",
            "weight": 1.0,
            "label": "Contains sesame — you have a sesame allergy",
        },
    ],

    # Dietary Restriction Tags 

    "animal_derived": [
        {
            "conflict_type": "dietary_restriction",
            "profile_value": "vegan",
            "weight": 0.8,
            "label": "Animal-derived ingredient — conflicts with vegan diet",
        },
        {
            "conflict_type": "dietary_restriction",
            "profile_value": "vegetarian",
            "weight": 0.7,
            "label": "Animal-derived ingredient — conflicts with vegetarian diet",
        },
    ],
    "contains_gluten": [
        {
            "conflict_type": "dietary_restriction",
            "profile_value": "gluten_free",
            "weight": 0.9,
            "label": "Contains gluten — conflicts with gluten-free diet",
        },
    ],
    "contains_dairy": [
        {
            "conflict_type": "dietary_restriction",
            "profile_value": "dairy_free",
            "weight": 0.8,
            "label": "Contains dairy — conflicts with dairy-free diet",
        },
        {
            "conflict_type": "dietary_restriction",
            "profile_value": "vegan",
            "weight": 0.8,
            "label": "Contains dairy — conflicts with vegan diet",
        },
    ],

    # Health Condition Tags 

    "high_glycemic": [
        {
            "conflict_type": "health_condition",
            "profile_value": "diabetes",
            "weight": 0.8,
            "label": "High glycemic ingredient — may spike blood sugar (diabetes risk)",
        },
    ],
    "high_sugar": [
        {
            "conflict_type": "health_condition",
            "profile_value": "diabetes",
            "weight": 0.9,
            "label": "High sugar content — dangerous for diabetes management",
        },
        {
            "conflict_type": "health_goal",
            "profile_value": "weight_loss",
            "weight": 0.5,
            "label": "High sugar content — works against weight loss goals",
        },
    ],
    "high_sodium": [
        {
            "conflict_type": "health_condition",
            "profile_value": "hypertension",
            "weight": 0.8,
            "label": "High sodium — dangerous for hypertension/high blood pressure",
        },
        {
            "conflict_type": "health_goal",
            "profile_value": "heart_health",
            "weight": 0.5,
            "label": "High sodium — works against heart health goals",
        },
    ],
    "high_saturated_fat": [
        {
            "conflict_type": "health_condition",
            "profile_value": "heart_disease",
            "weight": 0.8,
            "label": "High in saturated fat — risk factor for heart disease",
        },
        {
            "conflict_type": "health_goal",
            "profile_value": "heart_health",
            "weight": 0.5,
            "label": "High in saturated fat — works against heart health goals",
        },
        {
            "conflict_type": "health_goal",
            "profile_value": "weight_loss",
            "weight": 0.4,
            "label": "High in saturated fat — works against weight loss goals",
        },
    ],
    "high_cholesterol": [
        {
            "conflict_type": "health_condition",
            "profile_value": "heart_disease",
            "weight": 0.7,
            "label": "High cholesterol content — risk factor for heart disease",
        },
    ],
    "trans_fat": [
        {
            "conflict_type": "health_condition",
            "profile_value": "heart_disease",
            "weight": 0.9,
            "label": "Contains trans fats — strongly linked to heart disease",
        },
        {
            "conflict_type": "health_goal",
            "profile_value": "heart_health",
            "weight": 0.7,
            "label": "Contains trans fats — strongly works against heart health",
        },
    ],
    "inflammatory": [
        {
            "conflict_type": "health_condition",
            "profile_value": "autoimmune",
            "weight": 0.6,
            "label": "Inflammatory ingredient — may worsen autoimmune conditions",
        },
        {
            "conflict_type": "health_goal",
            "profile_value": "heart_health",
            "weight": 0.4,
            "label": "Inflammatory ingredient — works against heart health goals",
        },
    ],

    # Health Goal Tags 

    "high_calorie": [
        {
            "conflict_type": "health_goal",
            "profile_value": "weight_loss",
            "weight": 0.5,
            "label": "High calorie ingredient — works against weight loss goals",
        },
    ],
    "high_fat": [
        {
            "conflict_type": "health_goal",
            "profile_value": "weight_loss",
            "weight": 0.4,
            "label": "High fat content — works against weight loss goals",
        },
    ],

    # Artificial / Processed Tags 

    "artificial_additive": [
        {
            "conflict_type": "health_goal",
            "profile_value": "clean_eating",
            "weight": 0.5,
            "label": "Artificial additive — conflicts with clean eating goals",
        },
    ],
    "artificial_sweetener": [
        {
            "conflict_type": "health_goal",
            "profile_value": "clean_eating",
            "weight": 0.4,
            "label": "Artificial sweetener — conflicts with clean eating goals",
        },
    ],
    "artificial_color": [
        {
            "conflict_type": "health_goal",
            "profile_value": "clean_eating",
            "weight": 0.4,
            "label": "Artificial coloring — conflicts with clean eating goals",
        },
    ],
    "processed": [
        {
            "conflict_type": "health_goal",
            "profile_value": "clean_eating",
            "weight": 0.3,
            "label": "Highly processed ingredient — conflicts with clean eating goals",
        },
    ],
    "preservative": [
        {
            "conflict_type": "health_goal",
            "profile_value": "clean_eating",
            "weight": 0.2,
            "label": "Contains preservatives — conflicts with clean eating goals",
        },
    ],
}


# Penalty Points Configuration
# Base points deducted per conflict, before being multiplied by the weight.
# Separated by conflict type so allergen hits are far more punishing.
# ---------------------------------------------------------------------------

PENALTY_POINTS: dict[str, float] = {
    "allergy": 40.0,
    "dietary_restriction": 25.0,
    "health_condition": 20.0,
    "health_goal": 10.0,
}


# Lookup Helpers

def get_conflicts_for_tag(tag: str) -> list[dict]:
    """
    Return all potential conflicts associated with a given risk tag.

    Args:
        tag: A risk tag string from ingredient_metadata (e.g. "allergen_peanut").

    Returns:
        A list of conflict dicts, each containing ``conflict_type``,
        ``profile_value``, ``weight``, and ``label``.  Returns an empty list
        if the tag is unknown.
    """
    return TAG_CONFLICT_MAP.get(tag, [])


def get_penalty_points(conflict_type: str) -> float:
    """
    Return the base penalty points for a given conflict type.

    Args:
        conflict_type: One of "allergy", "dietary_restriction",
                       "health_condition", or "health_goal".

    Returns:
        Base penalty points as a float. Defaults to 10.0 for unknown types.
    """
    return PENALTY_POINTS.get(conflict_type, 10.0)


def get_all_tags() -> list[str]:
    """Return a sorted list of all known risk tags."""
    return sorted(TAG_CONFLICT_MAP.keys())
