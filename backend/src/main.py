from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings
from src.domain.exceptions import ConflictError, NotFoundError, ValidationError
from src.presentation.exception_handlers import (
    conflict_handler,
    not_found_handler,
    validation_handler,
)
from src.presentation.routers.companies import router as companies_router


def create_app() -> FastAPI:
    app = FastAPI(title="SDD App", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_exception_handler(NotFoundError, not_found_handler)
    app.add_exception_handler(ValidationError, validation_handler)
    app.add_exception_handler(ConflictError, conflict_handler)

    app.include_router(companies_router)

    return app


app = create_app()
