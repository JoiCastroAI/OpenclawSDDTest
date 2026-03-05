"""Integration tests for SQLAlchemyCompanyRepository.

These tests require a running PostgreSQL database.
They test CRUD operations, bulk delete, and pagination against a real database.
"""

from decimal import Decimal
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.company import Company
from src.infrastructure.database.repositories.company_repo import SQLAlchemyCompanyRepository


@pytest.fixture
def repo(db_session: AsyncSession) -> SQLAlchemyCompanyRepository:
    return SQLAlchemyCompanyRepository(db_session)


def _make_company(**overrides) -> Company:
    defaults = {
        "name": f"Company-{uuid4().hex[:8]}",
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zip_code": "94102",
        "country": "USA",
        "revenue": Decimal("1000000"),
        "expenses": Decimal("500000"),
        "employees": 50,
        "clients": 20,
    }
    defaults.update(overrides)
    return Company(**defaults)


@pytest.mark.asyncio
class TestSQLAlchemyCompanyRepository:
    async def test_save_and_find_by_id(self, repo: SQLAlchemyCompanyRepository) -> None:
        company = _make_company(name="Save Test Corp")
        saved = await repo.save(company)

        found = await repo.find_by_id(saved.id)

        assert found is not None
        assert found.name == "Save Test Corp"
        assert found.city == "San Francisco"
        assert found.revenue == Decimal("1000000")
        assert found.id == saved.id

    async def test_find_by_id_returns_none_when_not_found(
        self, repo: SQLAlchemyCompanyRepository
    ) -> None:
        result = await repo.find_by_id(uuid4())
        assert result is None

    async def test_find_all_with_pagination(self, repo: SQLAlchemyCompanyRepository) -> None:
        for i in range(5):
            await repo.save(_make_company(name=f"Paginated Corp {i}"))

        page1 = await repo.find_all(offset=0, limit=3)
        page2 = await repo.find_all(offset=3, limit=3)

        assert len(page1) == 3
        assert len(page2) == 2

    async def test_update_company(self, repo: SQLAlchemyCompanyRepository) -> None:
        company = _make_company(name="Original Name")
        saved = await repo.save(company)

        saved.name = "Updated Name"
        saved.city = "Boston"
        saved.revenue = Decimal("2000000")
        updated = await repo.update(saved)

        assert updated.name == "Updated Name"
        assert updated.city == "Boston"
        assert updated.revenue == Decimal("2000000")

    async def test_delete_company(self, repo: SQLAlchemyCompanyRepository) -> None:
        company = _make_company()
        saved = await repo.save(company)

        await repo.delete(saved.id)

        found = await repo.find_by_id(saved.id)
        assert found is None

    async def test_bulk_delete(self, repo: SQLAlchemyCompanyRepository) -> None:
        c1 = await repo.save(_make_company(name="Bulk Del 1"))
        c2 = await repo.save(_make_company(name="Bulk Del 2"))
        c3 = await repo.save(_make_company(name="Bulk Del 3"))

        await repo.bulk_delete([c1.id, c2.id])

        assert await repo.find_by_id(c1.id) is None
        assert await repo.find_by_id(c2.id) is None
        assert await repo.find_by_id(c3.id) is not None

    async def test_count(self, repo: SQLAlchemyCompanyRepository) -> None:
        initial_count = await repo.count()

        await repo.save(_make_company(name="Count Test 1"))
        await repo.save(_make_company(name="Count Test 2"))

        new_count = await repo.count()
        assert new_count == initial_count + 2
