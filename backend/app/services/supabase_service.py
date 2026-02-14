"""
Supabase Service — User Profile Storage

Fetches user profile for scoring. The profile is used by the scoring engine
to personalize ingredient risk analysis.

Expected table schema (user_profiles or similar):
    - user_id: UUID (primary key)
    - allergies: array or JSONB
    - dietary_restrictions: array or JSONB
    - health_conditions: array or JSONB
    - health_goals: array or JSONB
"""

from __future__ import annotations

import os
from typing import Any, Optional

from supabase import create_client, Client


# Default Profile (when user not found or no profile)

EMPTY_PROFILE = {
    "allergies": [],
    "dietary_restrictions": [],
    "health_conditions": [],
    "health_goals": [],
}

TABLE_NAME = "user_profiles"


# Client Singleton

_client: Optional[Client] = None


def _get_client() -> Client:
    """Lazy-initialize Supabase client to avoid import-time env errors."""
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")
        _client = create_client(url, key)
    return _client


# Public API

def get_user_profile(user_id: str) -> dict:
    """
    Fetch user profile by user_id for scoring engine.

    Args:
        user_id: UUID or string identifier of the user.

    Returns:
        Profile dict with keys allergies, dietary_restrictions, health_conditions,
        health_goals — each a list of strings. Returns EMPTY_PROFILE if user
        not found or on error.
    """
    try:
        client = _get_client()
        response = (
            client.table(TABLE_NAME)
            .select("allergies, dietary_restrictions, health_conditions, health_goals")
            .eq("user_id", user_id)
            .execute()
        )

        if not response.data or len(response.data) == 0:
            return EMPTY_PROFILE.copy()

        row = response.data[0]

        return {
            "allergies": _to_list(row.get("allergies")),
            "dietary_restrictions": _to_list(row.get("dietary_restrictions")),
            "health_conditions": _to_list(row.get("health_conditions")),
            "health_goals": _to_list(row.get("health_goals")),
        }

    except Exception:
        return EMPTY_PROFILE.copy()


def update_user_profile(
    user_id: str,
    allergies: list[str] | None = None,
    dietary_restrictions: list[str] | None = None,
    health_conditions: list[str] | None = None,
    health_goals: list[str] | None = None,
) -> dict:
    """
    Upsert user profile. Creates row if not exists, updates if exists.

    Args:
        user_id: User identifier.
        allergies: List of allergy strings (optional).
        dietary_restrictions: List of restriction strings (optional).
        health_conditions: List of condition strings (optional).
        health_goals: List of goal strings (optional).

    Returns:
        Updated profile dict in scoring-engine format.
    """
    try:
        client = _get_client()
        payload: dict[str, list[str]] = {}
        if allergies is not None:
            payload["allergies"] = _to_list(allergies)
        if dietary_restrictions is not None:
            payload["dietary_restrictions"] = _to_list(dietary_restrictions)
        if health_conditions is not None:
            payload["health_conditions"] = _to_list(health_conditions)
        if health_goals is not None:
            payload["health_goals"] = _to_list(health_goals)

        if not payload:
            return get_user_profile(user_id)

        response = (
            client.table(TABLE_NAME)
            .upsert(
                {"user_id": user_id, **payload},
                on_conflict="user_id",
            )
            .execute()
        )

        if response.data and len(response.data) > 0:
            row = response.data[0]
            return {
                "allergies": _to_list(row.get("allergies")),
                "dietary_restrictions": _to_list(row.get("dietary_restrictions")),
                "health_conditions": _to_list(row.get("health_conditions")),
                "health_goals": _to_list(row.get("health_goals")),
            }
        return get_user_profile(user_id)

    except Exception:
        return EMPTY_PROFILE.copy()


def _to_list(value: Any) -> list:
    """Convert value to list of strings; empty list if invalid."""
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item).strip().lower() for item in value if item]
    return []
