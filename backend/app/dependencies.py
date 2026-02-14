"""
Dependencies — FastAPI Dependency Injection
============================================

Provides injectable dependencies for route handlers.
"""

from __future__ import annotations

from typing import Optional

from fastapi import Depends
from supabase import Client

from app.config import Settings, get_settings
from app.database import get_supabase_client


def get_config() -> Settings:
    """Inject application settings."""
    return get_settings()


def get_db() -> Client:
    """Inject Supabase client."""
    return get_supabase_client()


def get_optional_user_id(user_id: Optional[str] = None) -> Optional[str]:
    """
    Extract optional user_id from request (query param or header).
    Used when the frontend may or may not send a logged-in user.
    """
    return user_id
