"""GET /health — Health check."""

from fastapi import APIRouter

router = APIRouter()


@router.get("")
@router.get("/", include_in_schema=False)
def health():
    """Health check endpoint."""
    return {"status": "ok"}
