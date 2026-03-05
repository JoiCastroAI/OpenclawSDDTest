from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class CompanyInput(BaseModel):
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


class CompanyOutput(BaseModel):
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

    @classmethod
    def from_entity(cls, entity: "Company") -> "CompanyOutput":
        from src.domain.entities.company import Company

        return cls(
            id=entity.id,
            name=entity.name,
            street=entity.street,
            city=entity.city,
            state=entity.state,
            zip_code=entity.zip_code,
            country=entity.country,
            revenue=entity.revenue,
            expenses=entity.expenses,
            profit=entity.profit,
            employees=entity.employees,
            clients=entity.clients,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )
