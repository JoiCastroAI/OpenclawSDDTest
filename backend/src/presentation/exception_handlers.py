from fastapi import Request
from fastapi.responses import JSONResponse

from src.domain.exceptions import ConflictError, NotFoundError, ValidationError


async def not_found_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={"code": "NOT_FOUND", "message": str(exc), "details": []},
    )


async def validation_handler(request: Request, exc: ValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"code": "VALIDATION_ERROR", "message": str(exc), "details": exc.details},
    )


async def conflict_handler(request: Request, exc: ConflictError) -> JSONResponse:
    return JSONResponse(
        status_code=409,
        content={"code": "CONFLICT", "message": str(exc), "details": []},
    )
