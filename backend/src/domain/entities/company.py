from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4


@dataclass
class Company:
    name: str
    id: UUID = field(default_factory=uuid4)
    street: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    country: str | None = None
    revenue: Decimal = Decimal("0")
    expenses: Decimal = Decimal("0")
    employees: int = 0
    clients: int = 0
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    @property
    def profit(self) -> Decimal:
        return self.revenue - self.expenses
