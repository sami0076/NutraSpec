"""
User Route — Profile CRUD (authenticated)

GET /user/profile — fetch authenticated user's profile
PUT /user/profile — update authenticated user's profile

Both endpoints require a valid Supabase JWT in the Authorization header.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.dependencies import require_current_user
from app.services.supabase_service import get_user_profile, update_user_profile

router = APIRouter(prefix="/user", tags=["user"])


# Schemas

class ProfileUpdate(BaseModel):
    """Request body for profile update (user_id comes from JWT)."""

    allergies: Optional[list[str]] = Field(None, description="List of allergies")
    dietary_restrictions: Optional[list[str]] = Field(
        None, description="Dietary restrictions (e.g. vegan, gluten_free)"
    )
    health_conditions: Optional[list[str]] = Field(
        None, description="Health conditions (e.g. diabetes, hypertension)"
    )
    health_goals: Optional[list[str]] = Field(
        None, description="Health goals (e.g. weight_loss, clean_eating)"
    )


# Endpoints

@router.get("/profile")
def get_profile(current_user: dict = Depends(require_current_user)) -> dict:
    """
    Fetch the authenticated user's profile.

    Returns allergies, dietary_restrictions, health_conditions, health_goals.
    """
    user_id = current_user["id"]
    profile = get_user_profile(user_id)
    return {
        "user_id": user_id,
        "allergies": profile["allergies"],
        "dietary_restrictions": profile["dietary_restrictions"],
        "health_conditions": profile["health_conditions"],
        "health_goals": profile["health_goals"],
    }


@router.put("/profile")
def put_profile(
    body: ProfileUpdate,
    current_user: dict = Depends(require_current_user),
) -> dict:
    """
    Update (upsert) the authenticated user's profile.

    Only provided fields are updated; others remain unchanged.
    """
    user_id = current_user["id"]

    profile = update_user_profile(
        user_id=user_id,
        allergies=body.allergies,
        dietary_restrictions=body.dietary_restrictions,
        health_conditions=body.health_conditions,
        health_goals=body.health_goals,
    )
    return {
        "user_id": user_id,
        "allergies": profile["allergies"],
        "dietary_restrictions": profile["dietary_restrictions"],
        "health_conditions": profile["health_conditions"],
        "health_goals": profile["health_goals"],
    }
