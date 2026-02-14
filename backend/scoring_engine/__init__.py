"""
Scoring engine — deterministic only. Input: ingredient list + profile. No AI, no images.
TODO: weight matrix, conflict detection, risk formula.
"""
from typing import TypedDict


class UserProfile(TypedDict):
    allergens: list[str]
    preferences: list[str]


class ScoreResult(TypedDict):
    classification: str
    score: float
    explanations: list[str]


def score_ingredients(ingredients: list[str], profile: UserProfile) -> ScoreResult:
    return {"classification": "unknown", "score": 0.0, "explanations": []}
