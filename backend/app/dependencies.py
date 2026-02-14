"""
Dependencies — FastAPI Dependency Injection

Provides injectable dependencies for route handlers, including
Supabase auth-based user extraction.
"""

from __future__ import annotations

from typing import Optional

from fastapi import Header, HTTPException

from app.config import Settings, get_settings
from app.database import get_supabase_client
from app.services.auth_service import verify_token
from supabase import Client


def get_config() -> Settings:
    """Inject application settings."""
    return get_settings()


def get_db() -> Client:
    """Inject Supabase client."""
    return get_supabase_client()


def get_current_user(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    """
    Extract authenticated user from Supabase JWT in Authorization header.

    Returns:
        User dict {'id': str, 'email': str} if valid token, None if no token.
    """
    if not authorization:
        return None

    if not authorization.startswith("Bearer "):
        return None

    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        return None

    user = verify_token(token)
    return user


def require_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """
    Same as get_current_user but raises 401 if not authenticated.
    Use this for endpoints that require login.
    """
    user = get_current_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user
