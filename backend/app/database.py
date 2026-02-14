"""
Database — Supabase Client

Provides a shared Supabase client for the application.
Initialized lazily to avoid import-time env errors.
"""

from __future__ import annotations

from typing import Optional

from supabase import Client, create_client

from app.config import get_settings


_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """
    Return the shared Supabase client. Creates it on first call.

    Raises:
        ValueError: If SUPABASE_URL or SUPABASE_KEY is not set.
    """
    global _client
    if _client is None:
        settings = get_settings()
        if not settings.supabase_url or not settings.supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")
        _client = create_client(settings.supabase_url, settings.supabase_key)
    return _client
