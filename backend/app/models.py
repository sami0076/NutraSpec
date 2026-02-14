"""Pydantic models for API request/response."""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class FlaggedIngredient(BaseModel):
    ingredient: str
    risk_level: str = "Medium Risk"
    reasons: list[str] = Field(default_factory=list)
    severity: float = 0.5


class ProfileUpdatePayload(BaseModel):
    """Payload for updating user profile. All fields optional."""

    allergies: Optional[list[str]] = None
    dietary_restrictions: Optional[list[str]] = None
    health_conditions: Optional[list[str]] = None
    health_goals: Optional[list[str]] = None


class AnalyzeResult(BaseModel):
    score: int = Field(ge=0, le=100)
    risk_classification: str
    flagged_ingredients: list[FlaggedIngredient] = Field(default_factory=list)
    summary: str
    total_ingredients: int = 0
    conflict_count: int = 0
    product_name: Optional[str] = None
    brand: Optional[str] = None
    ingredients: Optional[list[str]] = None
    confidence: Optional[str] = None
    audio_base64: Optional[str] = None
