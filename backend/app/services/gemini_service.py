"""
Gemini Service — Vision + Analysis (All-in-One AI)

Uses Gemini for:
  1. Vision: Extract product name, brand, ingredients from food label image
  2. Analysis: Grade ingredients against user profile → score, conflicts, summary

No scoring engine — Gemini handles extraction and risk analysis.
"""

from __future__ import annotations

import json
import os
import re
import time
from typing import Optional

from google import genai
from google.genai import types

from app.core.utils import to_title_case

# Retry config for 429 rate limits
MAX_RETRIES = 3
INITIAL_BACKOFF = 2.0  # seconds


def _extract_json(text: str) -> dict:
    """Extract JSON from Gemini response, handling markdown code blocks."""
    text = text.strip()
    code_block_pattern = r"```(?:json)?\s*([\s\S]*?)\s*```"
    matches = re.findall(code_block_pattern, text)
    if matches:
        text = matches[0].strip()
    json_pattern = r"\{[\s\S]*\}"
    json_matches = re.findall(json_pattern, text)
    if json_matches:
        text = max(json_matches, key=len)
    return json.loads(text)


VISION_PROMPT = """Analyze this food product image and extract product info in JSON only (no markdown):

{
  "product_name": "product name in Title Case",
  "brand": "brand if visible, else null",
  "ingredients": ["Ingredient1", "Ingredient2", ...],
  "confidence": "high|medium|low"
}

CRITICAL: Return at least one ingredient. If unclear, infer from product type.
Use Title Case. Return ONLY valid JSON."""

ANALYSIS_PROMPT_TEMPLATE = """Analyze these ingredients against the user's profile. Return ONLY valid JSON (no markdown):

Ingredients: {ingredients}

User Profile:
- Allergies: {allergies}
- Dietary restrictions (vegan, halal, vegetarian, gluten-free, etc.): {dietary_restrictions}
- Health conditions (diabetes, hypertension, etc.): {health_conditions}
- Health goals (weight loss, clean eating, etc.): {health_goals}

Return this exact JSON structure:
{{
  "score": 0-100,
  "risk_classification": "Low Risk" | "Medium Risk" | "High Risk",
  "flagged_ingredients": [
    {{"ingredient": "name", "risk_level": "High Risk"|"Medium Risk"|"Low Risk", "reasons": ["reason1"], "severity": 0.0-1.0}}
  ],
  "summary": "One sentence summary. For allergies/diet violations: lead with 'Not safe' or 'Not suitable'. Never imply safety when allergens are present."
}}

CRITICAL ALLERGEN RULES:
- Treat ingredient DERIVATIVES as allergens. "peanut butter" CONTAINS peanuts. "almond flour" CONTAINS tree nuts. "whey" CONTAINS milk. "egg whites" CONTAINS eggs.
- If user has "peanuts" allergy and ANY ingredient contains "peanut" (e.g. peanut butter, peanut oil), flag it as High Risk.
- If user has "tree_nuts" and ANY ingredient contains almond, cashew, walnut, etc., flag it.
- One allergen present = product is NOT safe. score must be low (under 30). risk_classification must be "High Risk".
- summary MUST start with "Not safe for your allergies" when any allergen is present.

Other rules:
- score: 100 = fully safe, 0 = dangerous. Allergies and dietary violations must drop score significantly.
- risk_classification: "High Risk" if ANY allergy or dietary restriction violated.
- Return ONLY the JSON object."""

DEFAULT_MODEL = "gemini-2.0-flash"


def _generate_with_retry(client, model: str, contents):
    """Call generate_content with retry on 429."""
    last_err = None
    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.generate_content(
                model=model,
                contents=contents,
            )
            return response
        except Exception as e:
            last_err = e
            err_str = str(e).upper()
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                if attempt < MAX_RETRIES - 1:
                    wait = INITIAL_BACKOFF * (2**attempt)
                    time.sleep(wait)
                    continue
            raise
    raise last_err


def analyze_vision(
    image_bytes: bytes,
    mime_type: str = "image/jpeg",
    api_key: Optional[str] = None,
    model: str = DEFAULT_MODEL,
) -> dict:
    """Extract product info and ingredients from image via Gemini vision."""
    key = api_key or os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY is not set")

    client = genai.Client(api_key=key)
    image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)

    response = _generate_with_retry(client, model, [image_part, VISION_PROMPT])

    if not response.text:
        raise ValueError("Gemini returned empty response")

    data = _extract_json(response.text)
    ingredients_raw = data.get("ingredients", [])
    if not isinstance(ingredients_raw, list):
        ingredients_raw = []

    ingredients_display = [to_title_case(str(i).strip()) for i in ingredients_raw if i]
    ingredients = [i.lower() for i in ingredients_display]

    return {
        "product_name": to_title_case(data.get("product_name") or "Unknown Product"),
        "brand": to_title_case(data.get("brand")) if data.get("brand") else None,
        "ingredients": ingredients,
        "ingredients_display": ingredients_display,
        "confidence": data.get("confidence") or "low",
    }


def analyze_ingredients(
    ingredients: list[str],
    user_profile: dict,
    api_key: Optional[str] = None,
    model: str = DEFAULT_MODEL,
) -> dict:
    """
    Grade ingredients against user profile via Gemini.
    Returns score, risk_classification, flagged_ingredients, summary.
    """
    key = api_key or os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY is not set")

    profile = user_profile or {}
    allergies = profile.get("allergies", []) or []
    dietary = profile.get("dietary_restrictions", []) or []
    conditions = profile.get("health_conditions", []) or []
    goals = profile.get("health_goals", []) or []

    prompt = ANALYSIS_PROMPT_TEMPLATE.format(
        ingredients=json.dumps(ingredients),
        allergies=json.dumps(allergies),
        dietary_restrictions=json.dumps(dietary),
        health_conditions=json.dumps(conditions),
        health_goals=json.dumps(goals),
    )

    client = genai.Client(api_key=key)
    response = _generate_with_retry(client, model, [prompt])

    if not response.text:
        raise ValueError("Gemini returned empty response")

    data = _extract_json(response.text)

    # Normalize flagged ingredients
    flagged_raw = data.get("flagged_ingredients", [])
    if not isinstance(flagged_raw, list):
        flagged_raw = []

    flagged = []
    for f in flagged_raw:
        if isinstance(f, dict):
            flagged.append({
                "ingredient": to_title_case(f.get("ingredient", "")),
                "risk_level": f.get("risk_level", "Medium Risk"),
                "reasons": f.get("reasons", []) if isinstance(f.get("reasons"), list) else [],
                "severity": float(f.get("severity", 0.5)),
            })

    return {
        "score": int(data.get("score", 100)),
        "risk_classification": data.get("risk_classification", "Low Risk"),
        "flagged_ingredients": flagged,
        "summary": str(data.get("summary", "Analysis complete.")),
    }
