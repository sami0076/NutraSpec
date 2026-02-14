"""
Core Package
=============

Exceptions, logger, and shared utilities.
"""

from app.core.exceptions import (
    AppException,
    ConfigurationError,
    NotFoundError,
    ValidationError,
)
from app.core.logger import get_logger, set_level

__all__ = [
    "AppException",
    "ConfigurationError",
    "NotFoundError",
    "ValidationError",
    "get_logger",
    "set_level",
]
