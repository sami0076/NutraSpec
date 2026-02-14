"""
Auth Dependencies — Supabase Token Verification

Extracts user_id from Supabase JWT for profile routes.
Uses remote verification via Supabase /auth/v1/user (no JWT secret needed).
Falls back to local JWT verification if SUPABASE_JWT_SECRET is set (faster).
"""

from __future__ import annotations

from typing import Optional

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import get_settings

_security = HTTPBearer(auto_error=False)


def _verify_via_supabase_api(token: str) -> Optional[str]:
    """Verify token by calling Supabase /auth/v1/user. Returns user_id or None."""
    settings = get_settings()
    url = (settings.supabase_url or "").rstrip("/") + "/auth/v1/user"
    # Auth API expects anon key; fall back to service role if anon not set
    key = settings.supabase_key or settings.supabase_service_role_key
    if not url or not key:
        return None
    try:
        with httpx.Client(timeout=10.0) as client:
            r = client.get(
                url,
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": key,
                },
            )
        if r.status_code == 200:
            data = r.json()
            uid = data.get("id")
            return str(uid) if uid else None
    except Exception:
        pass
    return None


def _verify_via_jwt(token: str) -> Optional[str]:
    """Verify token locally with JWT secret. Returns user_id or None."""
    try:
        import jwt
    except ImportError:
        return None
    settings = get_settings()
    secret = settings.supabase_jwt_secret
    if not secret:
        return None
    try:
        payload = jwt.decode(
            token,
            secret,
            audience="authenticated",
            algorithms=["HS256"],
        )
        sub = payload.get("sub")
        return str(sub) if sub else None
    except Exception:
        return None


async def get_optional_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_security),
) -> Optional[str]:
    """Extract user_id from Supabase JWT. Returns None if no/invalid token."""
    if not credentials or not credentials.credentials:
        return None
    token = credentials.credentials
    # Prefer local JWT verification (faster) if secret is set
    user_id = _verify_via_jwt(token)
    if user_id:
        return user_id
    # Fall back to Supabase API (no JWT secret needed)
    return _verify_via_supabase_api(token)


async def get_required_user_id(
    user_id: Optional[str] = Depends(get_optional_user_id),
) -> str:
    """Require authenticated user. Raises 401 if not logged in."""
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return user_id
