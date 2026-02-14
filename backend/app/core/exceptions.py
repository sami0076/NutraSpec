"""
Core Exceptions

Application-level exceptions. Service-specific errors (e.g. GeminiExtractionError)
may be defined in their respective modules; these are shared across the app.
"""

from __future__ import annotations


class AppException(Exception):
    """Base exception for application errors."""

    def __init__(self, message: str, status_code: int = 500) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ConfigurationError(AppException):
    """Raised when required configuration is missing or invalid."""

    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=500)


class NotFoundError(AppException):
    """Raised when a requested resource does not exist."""

    def __init__(self, message: str = "Resource not found") -> None:
        super().__init__(message, status_code=404)


class ValidationError(AppException):
    """Raised when request validation fails."""

    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=422)
