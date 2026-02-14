"""
Database — Supabase Client

Provides the Supabase client for user profiles and analysis cache.
"""

from __future__ import annotations

from typing import Optional

from supabase import Client, create_client

from app.config import get_settings

_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """Return the shared Supabase client (service role for backend ops)."""
    global _client
    if _client is None:
        settings = get_settings()
        url = (settings.supabase_url or "").rstrip("/")
        key = settings.supabase_service_role_key or settings.supabase_key
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
        _client = create_client(url, key)
    return _client
