"""GET /health — Health check."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def health():
    """Health check endpoint."""
    return {"status": "ok"}
