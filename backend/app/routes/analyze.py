"""
Analyze Route — POST /analyze

Receives image, extracts ingredients via Gemini, scores via engine,
returns risk result. Optionally includes TTS audio of summary.

Auth: optional. If a valid Supabase JWT is present, the user's profile
is loaded for personalized scoring. Otherwise an anonymous default is used.
"""

from __future__ import annotations

import base64

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.dependencies import get_current_user
from app.services.gemini_service import GeminiExtractionError, extract_ingredients_from_image
from app.services.scoring_service import score_ingredients
from app.services.supabase_service import get_user_profile
from app.services.elevenlabs_service import text_to_speech

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("")
async def analyze_image(
    image: UploadFile = File(...),
    include_audio: bool = Form(False),
    current_user: dict | None = Depends(get_current_user),
) -> dict:
    """
    Analyze a food label image for ingredient risk.

    - Extracts ingredients via Gemini
    - Fetches user profile from Supabase (if authenticated)
    - Runs scoring engine
    - Optionally generates TTS audio of summary
    """
    # Read image bytes
    content_type = image.content_type or "image/jpeg"
    mime_type = "image/jpeg" if "jpeg" in content_type or "jpg" in content_type else content_type
    if "png" in content_type:
        mime_type = "image/png"
    elif "webp" in content_type:
        mime_type = "image/webp"

    try:
        image_bytes = await image.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read image: {e}") from e

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Image is empty")

    # Extract ingredients via Gemini
    try:
        ingredients = extract_ingredients_from_image(image_bytes, mime_type=mime_type)
    except GeminiExtractionError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e

    if not ingredients:
        raise HTTPException(
            status_code=422,
            detail="No ingredients could be extracted from the image. Ensure it shows a food label.",
        ) from None

    # Get user profile (authenticated) or anonymous defaults
    user_id = current_user["id"] if current_user else None
    profile = get_user_profile(user_id) if user_id else {
        "allergies": [],
        "dietary_restrictions": [],
        "health_conditions": [],
        "health_goals": [],
    }

    # Score ingredients
    result = score_ingredients(ingredients, profile)

    # Optionally add TTS audio
    if include_audio and result.get("summary"):
        audio_bytes = text_to_speech(result["summary"])
        if audio_bytes:
            result["audio_base64"] = base64.b64encode(audio_bytes).decode("utf-8")
        else:
            result["audio_base64"] = None

    return result
