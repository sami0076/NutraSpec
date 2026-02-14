"""
Supabase Service — User Profiles & Analysis Cache

- User profiles: allergies, dietary_restrictions, health_conditions, health_goals
- Analysis cache: cache full analysis results by (ingredients_hash, profile_hash)
"""

from __future__ import annotations

import hashlib
import json
from typing import Any, Optional

from app.config import get_settings
from app.database import get_supabase_client

TABLE_PROFILES = "user_profiles"
TABLE_CACHE = "analysis_cache"

EMPTY_PROFILE = {
    "allergies": [],
    "dietary_restrictions": [],
    "health_conditions": [],
    "health_goals": [],
}


def _get_client():
    return get_supabase_client()


def _profile_hash(profile: dict) -> str:
    """Hash user profile for cache key."""
    canonical = json.dumps({
        "allergies": sorted(profile.get("allergies", []) or []),
        "dietary_restrictions": sorted(profile.get("dietary_restrictions", []) or []),
        "health_conditions": sorted(profile.get("health_conditions", []) or []),
        "health_goals": sorted(profile.get("health_goals", []) or []),
    }, sort_keys=True)
    return hashlib.sha256(canonical.encode()).hexdigest()[:16]


def _ingredients_hash(ingredients: list[str]) -> str:
    """Hash ingredients list for cache key."""
    canonical = "|".join(sorted(i.lower() for i in ingredients if i))
    return hashlib.sha256(canonical.encode()).hexdigest()[:16]


def cache_key(ingredients: list[str], profile: dict) -> str:
    """Composite cache key for analysis."""
    return f"{_ingredients_hash(ingredients)}_{_profile_hash(profile)}"


def _to_list(val) -> list:
    """Ensure value is a list of strings (handles JSONB, None, str)."""
    if val is None:
        return []
    if isinstance(val, list):
        return [str(x).strip().lower() for x in val if x is not None and str(x).strip()]
    if isinstance(val, str):
        try:
            p = json.loads(val)
            return _to_list(p) if p is not None else []
        except (json.JSONDecodeError, TypeError):
            return [val.strip().lower()] if val.strip() else []
    return []


def get_user_profile(user_id: Optional[str]) -> dict:
    """Fetch user profile. Returns EMPTY_PROFILE if not found."""
    if not user_id:
        return EMPTY_PROFILE.copy()
    try:
        client = _get_client()
        r = client.table(TABLE_PROFILES).select(
            "allergies, dietary_restrictions, health_conditions, health_goals"
        ).eq("user_id", user_id).execute()
        if not r.data or len(r.data) == 0:
            return EMPTY_PROFILE.copy()
        row = r.data[0]
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
    """Upsert user profile."""
    payload = {}
    if allergies is not None:
        payload["allergies"] = [str(x).strip().lower() for x in allergies if x]
    if dietary_restrictions is not None:
        payload["dietary_restrictions"] = [str(x).strip().lower() for x in dietary_restrictions if x]
    if health_conditions is not None:
        payload["health_conditions"] = [str(x).strip().lower() for x in health_conditions if x]
    if health_goals is not None:
        payload["health_goals"] = [str(x).strip().lower() for x in health_goals if x]

    if not payload:
        return get_user_profile(user_id)

    try:
        client = _get_client()
        doc = {"user_id": user_id, **payload}
        r = client.table(TABLE_PROFILES).upsert(doc, on_conflict="user_id").execute()
        if r.data and len(r.data) > 0:
            row = r.data[0]
            return {
                "allergies": _to_list(row.get("allergies")),
                "dietary_restrictions": _to_list(row.get("dietary_restrictions")),
                "health_conditions": _to_list(row.get("health_conditions")),
                "health_goals": _to_list(row.get("health_goals")),
            }
        return get_user_profile(user_id)
    except Exception:
        return get_user_profile(user_id)


def get_cached_analysis(key: str) -> Optional[dict]:
    """Get cached analysis result."""
    try:
        client = _get_client()
        r = client.table(TABLE_CACHE).select("result").eq("cache_key", key).execute()
        if r.data and len(r.data) > 0:
            return r.data[0].get("result")
    except Exception:
        pass
    return None


def set_cached_analysis(key: str, result: dict) -> None:
    """Cache analysis result."""
    try:
        client = _get_client()
        client.table(TABLE_CACHE).upsert(
            {"cache_key": key, "result": result},
            on_conflict="cache_key",
        ).execute()
    except Exception:
        pass
