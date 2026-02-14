"""
FoodFinder.AI — FastAPI Entrypoint
===================================

AI-powered ingredient risk scoring. Image → Gemini extraction → Scoring engine.
"""

from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.exceptions import AppException
from app.routes import analyze_router, health_router, user_router

# Load .env before other app imports that read env vars
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle."""
    yield


app = FastAPI(
    title="FoodFinder.AI",
    description="AI ingredient risk scoring — extract ingredients from labels, score against user profile.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend (Vite dev server, local network for mobile testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://localhost:5173",
        "http://127.0.0.1:5173",
        "https://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(analyze_router)
app.include_router(user_router)


@app.exception_handler(AppException)
def handle_app_exception(request, exc: AppException):
    from fastapi.responses import JSONResponse

    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )
