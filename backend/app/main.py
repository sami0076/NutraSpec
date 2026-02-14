"""
FoodFinder.AI Backend — FastAPI Application

Endpoints:
  GET  /            — Root (alive check)
  POST /analyze     — Analyze food label image (multipart: image + include_audio)
  GET  /user/profile — Get user profile (auth required)
  PUT  /user/profile — Update user profile (auth required)
  GET  /health      — Health check
"""

from __future__ import annotations

import logging
import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path

# ---------------------------------------------------------------------------
# .env loading — try multiple locations so it works locally and on Railway
# On Railway, env vars come from the dashboard, so missing .env is fine.
# ---------------------------------------------------------------------------
try:
    from dotenv import load_dotenv

    _this_dir = Path(__file__).resolve().parent          # backend/app/
    _backend_dir = _this_dir.parent                      # backend/
    _project_root = _backend_dir.parent                  # project root

    for candidate in [
        _project_root / ".env",       # <project>/.env  (local dev)
        _backend_dir / ".env",        # backend/.env    (alt local layout)
        Path.cwd() / ".env",          # cwd fallback    (Railway sets cwd)
    ]:
        if candidate.exists():
            load_dotenv(candidate)
            break
except Exception:
    pass  # dotenv is optional on Railway — env vars come from dashboard

# ---------------------------------------------------------------------------
# Logging — so Railway captures startup info / errors
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger("foodfinder")
logger.info("Starting FoodFinder.AI backend...")
logger.info("Python %s", sys.version)
logger.info("CWD: %s", os.getcwd())

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

try:
    from app.routes import analyze, health, user
    logger.info("All route modules imported successfully")
except Exception as exc:
    logger.exception("FATAL — failed to import route modules: %s", exc)
    raise

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle."""
    port = os.environ.get("PORT", "?")
    logger.info("App is alive — listening on PORT=%s", port)
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title="FoodFinder.AI API",
    description="AI-powered ingredient risk analysis for food labels",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False,
)

# ---------------------------------------------------------------------------
# CORS — allow all origins (credentials=False so wildcard is valid per spec)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# ---------------------------------------------------------------------------
# Root endpoint — basic alive check (no auth, no deps)
# ---------------------------------------------------------------------------
@app.get("/")
async def root():
    return JSONResponse({"status": "ok", "service": "FoodFinder.AI API"})


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
app.include_router(user.router)
app.include_router(health.router, prefix="/health", tags=["health"])

logger.info("All routers registered. App ready.")
