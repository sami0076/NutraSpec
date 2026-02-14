"""API routes."""

from app.routes.analyze import router as analyze_router
from app.routes.health import router as health_router
from app.routes.user import router as user_router

__all__ = ["analyze_router", "health_router", "user_router"]
