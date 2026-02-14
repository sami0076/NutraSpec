"""Shared utilities."""

import re


def to_title_case(s: str) -> str:
    """Capitalize first letter of each word for display."""
    if not s or not isinstance(s, str):
        return s
    return re.sub(r"\b\w", lambda m: m.group(0).upper(), s.strip().lower())
