"""
Gemini Service — Ingredient Extraction
=======================================

Image → structured ingredient list via Gemini vision API.

This service performs extraction only. It does NOT:
- Calculate risk
- Assign severity
- Personalize results

Output is passed to the scoring engine for deterministic analysis.
"""

from __future__ import annotations

import json
import os
from typing import Optional

from google import genai
from google.genai import types
from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Response Schema
# ---------------------------------------------------------------------------

class IngredientExtraction(BaseModel):
    """Structured output from Gemini for ingredient extraction."""

    ingredients: list[str]


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

EXTRACTION_PROMPT = """Extract all ingredient names from this food product label image.

Rules:
- List each ingredient exactly as it appears on the label, in order when possible
- Use lowercase for consistency
- Include sub-ingredients in parentheses (e.g. "soy lecithin (emulsifier)")
- Do not include nutritional values, serving sizes, or other non-ingredient text
- If no ingredients are visible or the image is not a food label, return an empty list
"""

DEFAULT_MODEL = "gemini-2.0-flash"


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------

class GeminiExtractionError(Exception):
    """Raised when ingredient extraction fails."""

    pass


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def extract_ingredients_from_image(
    image_bytes: bytes,
    mime_type: str = "image/jpeg",
    api_key: Optional[str] = None,
    model: str = DEFAULT_MODEL,
) -> list[str]:
    """
    Extract ingredient names from a food label image using Gemini vision.

    Args:
        image_bytes: Raw image data (JPEG, PNG, etc.).
        mime_type: MIME type of the image (e.g. "image/jpeg", "image/png").
        api_key: Gemini API key. If None, uses GEMINI_API_KEY env var.
        model: Gemini model ID (default: gemini-2.0-flash).

    Returns:
        List of ingredient name strings, e.g. ["maltodextrin", "peanuts", "soy lecithin"].

    Raises:
        GeminiExtractionError: If API key is missing, extraction fails, or response is invalid.
    """
    key = api_key or os.getenv("GEMINI_API_KEY")
    if not key:
        raise GeminiExtractionError("GEMINI_API_KEY is not set")

    try:
        client = genai.Client(api_key=key)
        image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)

        response = client.models.generate_content(
            model=model,
            contents=[image_part, EXTRACTION_PROMPT],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=IngredientExtraction,
            ),
        )

        if not response.text:
            raise GeminiExtractionError("Gemini returned empty response")

        parsed = json.loads(response.text)
        ingredients = parsed.get("ingredients", [])

        if not isinstance(ingredients, list):
            raise GeminiExtractionError(
                f"Expected ingredients to be a list, got {type(ingredients)}"
            )

        # Normalize: ensure all items are non-empty strings
        result = [
            str(item).strip().lower()
            for item in ingredients
            if isinstance(item, str) and item.strip()
        ]
        return result

    except json.JSONDecodeError as e:
        raise GeminiExtractionError(f"Invalid JSON in Gemini response: {e}") from e
    except Exception as e:
        if isinstance(e, GeminiExtractionError):
            raise
        raise GeminiExtractionError(f"Gemini extraction failed: {e}") from e
