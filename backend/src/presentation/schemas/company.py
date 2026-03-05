from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class CompanyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    street: str | None = Field(None, max_length=255)
    city: str | None = Field(None, max_length=100)
    state: str | None = Field(None, max_length=100)
    zip_code: str | None = Field(None, max_length=20)
    country: str | None = Field(None, max_length=100)
    revenue: Decimal = Field(Decimal("0"), ge=0)
    expenses: Decimal = Field(Decimal("0"), ge=0)
    employees: int = Field(0, ge=0)
    clients: int = Field(0, ge=0)

    model_config = {"str_strip_whitespace": True}


class CompanyUpdate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    street: str | None = Field(None, max_length=255)
    city: str | None = Field(None, max_length=100)
    state: str | None = Field(None, max_length=100)
    zip_code: str | None = Field(None, max_length=20)
    country: str | None = Field(None, max_length=100)
    revenue: Decimal = Field(Decimal("0"), ge=0)
    expenses: Decimal = Field(Decimal("0"), ge=0)
    employees: int = Field(0, ge=0)
    clients: int = Field(0, ge=0)

    model_config = {"str_strip_whitespace": True}


class CompanyResponse(BaseModel):
    id: UUID
    name: str
    street: str | None
    city: str | None
    state: str | None
    zip_code: str | None
    country: str | None
    revenue: Decimal
    expenses: Decimal
    profit: Decimal
    employees: int
    clients: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BulkDeleteRequest(BaseModel):
    ids: list[UUID] = Field(..., min_length=1)
