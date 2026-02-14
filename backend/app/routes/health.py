"""
Health Route — GET /health

Health check for load balancers and monitoring.
"""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    """Return service status."""
    return {"status": "ok"}
