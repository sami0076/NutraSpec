"""
POST /analyze — Food label image analysis.

Accepts multipart form: image file + include_audio (true/false).
Returns AnalyzeResult (score, risk_classification, flagged_ingredients, summary, etc.).
Uses Gemini for vision + analysis. Caches results by (ingredients, profile) hash.
"""

from __future__ import annotations

import base64
import json
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, status, UploadFile

from app.dependencies import get_optional_user_id
from app.models import AnalyzeResult, FlaggedIngredient
from app.services.gemini_service import analyze_vision, analyze_ingredients
from app.services.supabase_service import (
    get_user_profile,
    cache_key,
    get_cached_analysis,
    set_cached_analysis,
)
from app.services.elevenlabs_service import text_to_speech
from app.services.allergen_check import check_allergens, merge_allergen_flags

router = APIRouter()


def _build_result(
    vision: dict,
    analysis: dict,
    include_audio: bool,
) -> dict:
    """Build AnalyzeResult dict from vision + analysis."""
    ingredients_display = vision.get("ingredients_display") or vision.get("ingredients", [])
    flagged = [
        FlaggedIngredient(
            ingredient=f.get("ingredient", ""),
            risk_level=f.get("risk_level", "Medium Risk"),
            reasons=f.get("reasons", []),
            severity=f.get("severity", 0.5),
        )
        for f in analysis.get("flagged_ingredients", [])
    ]
    summary = analysis.get("summary", "Analysis complete.")
    audio_b64: Optional[str] = None
    if include_audio and summary:
        audio_bytes = text_to_speech(summary)
        if audio_bytes:
            audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
    return {
        "score": analysis.get("score", 100),
        "risk_classification": analysis.get("risk_classification", "Low Risk"),
        "flagged_ingredients": [f.model_dump() for f in flagged],
        "summary": summary,
        "total_ingredients": len(ingredients_display),
        "conflict_count": len(flagged),
        "product_name": vision.get("product_name"),
        "brand": vision.get("brand"),
        "ingredients": ingredients_display,
        "confidence": vision.get("confidence"),
        "audio_base64": audio_b64,
    }


def _ensure_list(val) -> list:
    """Normalize to list of strings (handles Supabase JSONB, strings, etc.)."""
    if val is None:
        return []
    if isinstance(val, list):
        return [str(x).strip().lower() for x in val if x]
    if isinstance(val, str):
        try:
            parsed = json.loads(val)
            return _ensure_list(parsed) if parsed is not None else []
        except json.JSONDecodeError:
            return [val.strip().lower()] if val.strip() else []
    return []


@router.post("/", response_model=AnalyzeResult)
async def analyze(
    image: UploadFile = File(...),
    include_audio: str = Form("false"),
    profile_json: Optional[str] = Form(None),  # Fallback: profile from frontend
    user_id: Optional[str] = Depends(get_optional_user_id),
):
    """
    Analyze a food label image.

    - **image**: Image file (JPEG/PNG)
    - **include_audio**: "true" to generate TTS summary

    Returns score, risk_classification, flagged_ingredients, summary, product info.
    """
    include_audio_bool = include_audio.lower() in ("true", "1", "yes")

    # Validate image
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image (JPEG, PNG, etc.)",
        )

    try:
        image_bytes = await image.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read image: {e}",
        )

    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image file is empty",
        )

    mime = image.content_type or "image/jpeg"

    # 1. Vision extraction (always run — not cached)
    try:
        vision = analyze_vision(image_bytes, mime_type=mime)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )
    except Exception as e:
        err_msg = str(e)
        if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gemini API rate limit reached. Please wait a minute and try again.",
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Vision analysis failed: {e}",
        )

    ingredients = vision.get("ingredients") or vision.get("ingredients_display") or []
    profile = get_user_profile(user_id)

    # Merge with profile from request (fallback when auth/DB fails)
    if profile_json:
        try:
            req_profile = json.loads(profile_json)
            if isinstance(req_profile, dict):
                for key in ("allergies", "dietary_restrictions", "health_conditions", "health_goals"):
                    req_vals = _ensure_list(req_profile.get(key))
                    if req_vals:
                        existing = _ensure_list(profile.get(key))
                        merged = list(dict.fromkeys(existing + req_vals))
                        profile = {**profile, key: merged}
        except json.JSONDecodeError:
            pass

    # 2. Check cache (analysis only — keyed by ingredients + profile)
    key = cache_key(ingredients, profile)
    cached = get_cached_analysis(key)
    if cached:
        # Run deterministic allergen check on cached result too (in case cache was wrong)
        det_flags = check_allergens(ingredients, profile.get("allergies") or [])
        cached = merge_allergen_flags(cached, det_flags)
        return AnalyzeResult(**_build_result(vision, cached, include_audio_bool))

    # 3. Run Gemini analysis
    try:
        analysis = analyze_ingredients(ingredients, profile)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )
    except Exception as e:
        err_msg = str(e)
        if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gemini API rate limit reached. Please wait a minute and try again.",
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {e}",
        )

    # 3b. Deterministic allergen check — catch allergens Gemini may have missed
    allergies = profile.get("allergies") or []
    det_flags = check_allergens(ingredients, allergies)
    analysis = merge_allergen_flags(analysis, det_flags)

    # 4. Cache analysis (without audio — audio is generated per-request if requested)
    cache_payload = {
        "score": analysis["score"],
        "risk_classification": analysis["risk_classification"],
        "flagged_ingredients": analysis["flagged_ingredients"],
        "summary": analysis["summary"],
    }
    set_cached_analysis(key, cache_payload)

    return AnalyzeResult(**_build_result(vision, analysis, include_audio_bool))

