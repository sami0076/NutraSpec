"""
FoodFinder.AI Backend — FastAPI Application

Endpoints:
  POST /analyze     — Analyze food label image (multipart: image + include_audio)
  GET  /user/profile — Get user profile (auth required)
  PUT  /user/profile — Update user profile (auth required)
  GET  /health      — Health check
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv

# Load .env from project root or backend/
_root = Path(__file__).resolve().parents[2]
load_dotenv(_root / ".env")
load_dotenv(_root / "backend" / ".env")  # fallback if .env lives in backend/

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import analyze, health, user


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle."""
    yield


app = FastAPI(
    title="FoodFinder.AI API",
    description="AI-powered ingredient risk analysis for food labels",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
app.include_router(user.router)
app.include_router(health.router, prefix="/health", tags=["health"])
