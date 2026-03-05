from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from src.domain.entities.company import Company


class TestCompanyEntity:
    def test_instantiation_with_all_fields(self) -> None:
        company_id = uuid4()
        now = datetime.utcnow()
        company = Company(
            id=company_id,
            name="Acme Corp",
            street="123 Main St",
            city="San Francisco",
            state="CA",
            zip_code="94102",
            country="USA",
            revenue=Decimal("5000000"),
            expenses=Decimal("3000000"),
            employees=100,
            clients=50,
            created_at=now,
            updated_at=now,
        )

        assert company.id == company_id
        assert company.name == "Acme Corp"
        assert company.street == "123 Main St"
        assert company.city == "San Francisco"
        assert company.state == "CA"
        assert company.zip_code == "94102"
        assert company.country == "USA"
        assert company.revenue == Decimal("5000000")
        assert company.expenses == Decimal("3000000")
        assert company.employees == 100
        assert company.clients == 50

    def test_instantiation_with_defaults(self) -> None:
        company = Company(name="Acme Corp")

        assert isinstance(company.id, UUID)
        assert company.name == "Acme Corp"
        assert company.street is None
        assert company.city is None
        assert company.state is None
        assert company.zip_code is None
        assert company.country is None
        assert company.revenue == Decimal("0")
        assert company.expenses == Decimal("0")
        assert company.employees == 0
        assert company.clients == 0
        assert isinstance(company.created_at, datetime)
        assert isinstance(company.updated_at, datetime)

    def test_profit_computed_property(self) -> None:
        company = Company(
            name="Acme Corp",
            revenue=Decimal("5000000"),
            expenses=Decimal("3000000"),
        )

        assert company.profit == Decimal("2000000")

    def test_profit_with_zero_values(self) -> None:
        company = Company(name="New Corp")

        assert company.profit == Decimal("0")

    def test_profit_negative_when_expenses_exceed_revenue(self) -> None:
        company = Company(
            name="Struggling Corp",
            revenue=Decimal("1000000"),
            expenses=Decimal("3000000"),
        )

        assert company.profit == Decimal("-2000000")

    def test_fields_are_mutable(self) -> None:
        company = Company(name="Old Name")
        company.name = "New Name"
        company.city = "Boston"
        company.revenue = Decimal("1000000")

        assert company.name == "New Name"
        assert company.city == "Boston"
        assert company.revenue == Decimal("1000000")

    def test_default_id_is_unique(self) -> None:
        c1 = Company(name="Company A")
        c2 = Company(name="Company B")

        assert c1.id != c2.id
