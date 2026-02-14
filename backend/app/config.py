"""
Config — Environment Variables

Reads and exposes environment variables for the backend.
Load .env via python-dotenv before importing this module (e.g. in main.py).
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

    # ---- Gemini ----
    gemini_api_key: Optional[str] = None

    # ---- ElevenLabs ----
    elevenlabs_api_key: Optional[str] = None

    # ---- Supabase ----
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None

    # ---- Server ----
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    def __init__(self) -> None:
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
        # Support both SUPABASE_* and VITE_SUPABASE_* env vars so a single
        # root .env works for both backend and Vite frontend.
        self.supabase_url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")

        host = os.getenv("BACKEND_HOST")
        if host:
            self.backend_host = host

        port = os.getenv("BACKEND_PORT")
        if port:
            try:
                self.backend_port = int(port)
            except ValueError:
                pass
