"""
User Route — Profile CRUD
===========================

GET /user/profile — fetch user profile
PUT /user/profile — update user profile
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.supabase_service import get_user_profile, update_user_profile

router = APIRouter(prefix="/user", tags=["user"])


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------


class ProfileUpdate(BaseModel):
    """Request body for profile update."""

    user_id: str = Field(..., description="User identifier")
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


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.get("/profile")
def get_profile(user_id: str = Query(..., description="User identifier")) -> dict:
    """
    Fetch user profile by user_id.

    Returns allergies, dietary_restrictions, health_conditions, health_goals.
    """
    profile = get_user_profile(user_id)
    # Distinguish "empty default" from "user has empty profile" — for now we return same shape
    return {
        "user_id": user_id,
        "allergies": profile["allergies"],
        "dietary_restrictions": profile["dietary_restrictions"],
        "health_conditions": profile["health_conditions"],
        "health_goals": profile["health_goals"],
    }


@router.put("/profile")
def put_profile(body: ProfileUpdate) -> dict:
    """
    Update (upsert) user profile.

    Only provided fields are updated; others remain unchanged.
    """
    if not body.user_id or not body.user_id.strip():
        raise HTTPException(status_code=422, detail="user_id is required")

    profile = update_user_profile(
        user_id=body.user_id.strip(),
        allergies=body.allergies,
        dietary_restrictions=body.dietary_restrictions,
        health_conditions=body.health_conditions,
        health_goals=body.health_goals,
    )
    return {
        "user_id": body.user_id,
        "allergies": profile["allergies"],
        "dietary_restrictions": profile["dietary_restrictions"],
        "health_conditions": profile["health_conditions"],
        "health_goals": profile["health_goals"],
    }
