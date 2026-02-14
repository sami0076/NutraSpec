"""
User profile routes — GET /user/profile, PUT /user/profile

Requires Supabase JWT. user_id is extracted from token.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_required_user_id
from app.models import ProfileUpdatePayload
from app.services.supabase_service import get_user_profile, update_user_profile

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/profile")
async def get_profile(user_id: str = Depends(get_required_user_id)):
    """Get the authenticated user's dietary profile."""
    profile = get_user_profile(user_id)
    return {
        "user_id": user_id,
        "allergies": profile.get("allergies", []),
        "dietary_restrictions": profile.get("dietary_restrictions", []),
        "health_conditions": profile.get("health_conditions", []),
        "health_goals": profile.get("health_goals", []),
    }


@router.put("/profile")
async def put_profile(
    payload: ProfileUpdatePayload,
    user_id: str = Depends(get_required_user_id),
):
    """
    Update the authenticated user's dietary profile.

    Send JSON body with any of: allergies, dietary_restrictions, health_conditions, health_goals.
    """
    profile = update_user_profile(
        user_id,
        allergies=payload.allergies,
        dietary_restrictions=payload.dietary_restrictions,
        health_conditions=payload.health_conditions,
        health_goals=payload.health_goals,
    )
    return {
        "user_id": user_id,
        "allergies": profile.get("allergies", []),
        "dietary_restrictions": profile.get("dietary_restrictions", []),
        "health_conditions": profile.get("health_conditions", []),
        "health_goals": profile.get("health_goals", []),
    }

