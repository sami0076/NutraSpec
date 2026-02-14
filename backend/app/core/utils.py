"""
Core Utils

Shared utility functions.
"""

from __future__ import annotations

from typing import Any


def ensure_list(value: Any) -> list:
    """
    Convert a value to a list of non-empty strings. Used for profile fields.

    Args:
        value: Raw value (list, None, or other).

    Returns:
        List of stripped lowercase strings; empty list if invalid.
    """
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item).strip().lower() for item in value if item]
    return []
