"""
Auth Service — Supabase JWT Verification

Verifies the Supabase access token from the Authorization header
and extracts the authenticated user_id.
"""

from __future__ import annotations

from typing import Optional

from app.core.logger import get_logger
from app.database import get_supabase_client

logger = get_logger(__name__)


def verify_token(token: str) -> Optional[dict]:
    """
    Verify a Supabase access token and return the user object.

    Uses supabase.auth.get_user(token) which validates the JWT
    against Supabase's auth service and returns user metadata.

    Args:
        token: The JWT access_token from the Authorization header.

    Returns:
        User dict with at least 'id' and 'email', or None if invalid.
    """
    try:
        client = get_supabase_client()
        response = client.auth.get_user(token)

        if response and response.user:
            return {
                "id": response.user.id,
                "email": response.user.email,
            }

        return None

    except Exception as e:
        logger.warning("Token verification failed: %s", e)
        return None
