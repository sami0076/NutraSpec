"""
Config — Environment Variables

Reads and exposes environment variables for the backend.
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Optional


@lru_cache
def get_settings() -> "Settings":
    """Return cached settings instance."""
    return Settings()


class Settings:
    """Application settings from environment variables."""

    gemini_api_key: Optional[str] = None
    elevenlabs_api_key: Optional[str] = None
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
    supabase_service_role_key: Optional[str] = None
    supabase_jwt_secret: Optional[str] = None
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    def __init__(self) -> None:
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
        self.supabase_url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")
        self.supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.supabase_jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        if host := os.getenv("BACKEND_HOST"):
            self.backend_host = host
        if port := os.getenv("BACKEND_PORT"):
            try:
                self.backend_port = int(port)
            except ValueError:
                pass
