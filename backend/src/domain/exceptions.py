class DomainError(Exception):
    """Base domain exception."""


class NotFoundError(DomainError):
    pass


class ValidationError(DomainError):
    def __init__(self, message: str, details: list[dict] | None = None) -> None:
        super().__init__(message)
        self.details = details or []


class ConflictError(DomainError):
    pass
