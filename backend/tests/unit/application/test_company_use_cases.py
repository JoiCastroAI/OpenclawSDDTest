from datetime import datetime
from decimal import Decimal
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest
from sqlalchemy.exc import IntegrityError

from src.application.dtos.company import CompanyInput
from src.application.use_cases.bulk_delete_companies import BulkDeleteCompaniesUseCase
from src.application.use_cases.create_company import CreateCompanyUseCase
from src.application.use_cases.delete_company import DeleteCompanyUseCase
from src.application.use_cases.get_company import GetCompanyUseCase
from src.application.use_cases.list_companies import ListCompaniesUseCase
from src.application.use_cases.update_company import UpdateCompanyUseCase
from src.domain.entities.company import Company
from src.domain.exceptions import ConflictError, NotFoundError
from src.domain.repositories.company_repository import CompanyRepository


def _make_company(**overrides) -> Company:
    defaults = {
        "id": uuid4(),
        "name": "Acme Corp",
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zip_code": "94102",
        "country": "USA",
        "revenue": Decimal("5000000"),
        "expenses": Decimal("3000000"),
        "employees": 100,
        "clients": 50,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    defaults.update(overrides)
    return Company(**defaults)


@pytest.fixture
def repo() -> AsyncMock:
    return AsyncMock(spec=CompanyRepository)


class TestListCompaniesUseCase:
    @pytest.mark.asyncio
    async def test_returns_paginated_list(self, repo: AsyncMock) -> None:
        companies = [_make_company(name=f"Company {i}") for i in range(3)]
        repo.find_all.return_value = companies
        repo.count.return_value = 3

        use_case = ListCompaniesUseCase(repo)
        result = await use_case.execute(offset=0, limit=50)

        assert len(result["items"]) == 3
        assert result["total"] == 3
        assert result["offset"] == 0
        assert result["limit"] == 50

    @pytest.mark.asyncio
    async def test_returns_empty_list(self, repo: AsyncMock) -> None:
        repo.find_all.return_value = []
        repo.count.return_value = 0

        use_case = ListCompaniesUseCase(repo)
        result = await use_case.execute()

        assert result["items"] == []
        assert result["total"] == 0


class TestGetCompanyUseCase:
    @pytest.mark.asyncio
    async def test_returns_company_when_found(self, repo: AsyncMock) -> None:
        company = _make_company()
        repo.find_by_id.return_value = company

        use_case = GetCompanyUseCase(repo)
        result = await use_case.execute(company.id)

        assert result.id == company.id
        assert result.name == company.name
        assert result.profit == company.profit

    @pytest.mark.asyncio
    async def test_raises_not_found_when_missing(self, repo: AsyncMock) -> None:
        repo.find_by_id.return_value = None

        use_case = GetCompanyUseCase(repo)
        with pytest.raises(NotFoundError):
            await use_case.execute(uuid4())


class TestCreateCompanyUseCase:
    @pytest.mark.asyncio
    async def test_creates_company_successfully(self, repo: AsyncMock) -> None:
        company = _make_company()
        repo.save.return_value = company

        use_case = CreateCompanyUseCase(repo)
        data = CompanyInput(
            name="Acme Corp",
            street="123 Main St",
            city="San Francisco",
            state="CA",
            revenue=Decimal("5000000"),
            expenses=Decimal("3000000"),
            employees=100,
            clients=50,
        )
        result = await use_case.execute(data)

        assert result.name == "Acme Corp"
        repo.save.assert_called_once()

    @pytest.mark.asyncio
    async def test_raises_conflict_on_duplicate_name(self, repo: AsyncMock) -> None:
        repo.save.side_effect = IntegrityError("duplicate", {}, None)

        use_case = CreateCompanyUseCase(repo)
        data = CompanyInput(name="Existing Corp")

        with pytest.raises(ConflictError):
            await use_case.execute(data)


class TestUpdateCompanyUseCase:
    @pytest.mark.asyncio
    async def test_updates_company_successfully(self, repo: AsyncMock) -> None:
        company = _make_company()
        repo.find_by_id.return_value = company
        repo.update.return_value = company

        use_case = UpdateCompanyUseCase(repo)
        data = CompanyInput(name="Updated Corp", revenue=Decimal("6000000"))
        result = await use_case.execute(company.id, data)

        assert result is not None
        repo.update.assert_called_once()

    @pytest.mark.asyncio
    async def test_raises_not_found_when_missing(self, repo: AsyncMock) -> None:
        repo.find_by_id.return_value = None

        use_case = UpdateCompanyUseCase(repo)
        data = CompanyInput(name="Updated Corp")

        with pytest.raises(NotFoundError):
            await use_case.execute(uuid4(), data)

    @pytest.mark.asyncio
    async def test_raises_conflict_on_duplicate_name(self, repo: AsyncMock) -> None:
        company = _make_company()
        repo.find_by_id.return_value = company
        repo.update.side_effect = IntegrityError("duplicate", {}, None)

        use_case = UpdateCompanyUseCase(repo)
        data = CompanyInput(name="Existing Corp")

        with pytest.raises(ConflictError):
            await use_case.execute(company.id, data)


class TestDeleteCompanyUseCase:
    @pytest.mark.asyncio
    async def test_deletes_company_successfully(self, repo: AsyncMock) -> None:
        company = _make_company()
        repo.find_by_id.return_value = company

        use_case = DeleteCompanyUseCase(repo)
        await use_case.execute(company.id)

        repo.delete.assert_called_once_with(company.id)

    @pytest.mark.asyncio
    async def test_raises_not_found_when_missing(self, repo: AsyncMock) -> None:
        repo.find_by_id.return_value = None

        use_case = DeleteCompanyUseCase(repo)
        with pytest.raises(NotFoundError):
            await use_case.execute(uuid4())


class TestBulkDeleteCompaniesUseCase:
    @pytest.mark.asyncio
    async def test_bulk_deletes_successfully(self, repo: AsyncMock) -> None:
        ids = [uuid4(), uuid4(), uuid4()]

        use_case = BulkDeleteCompaniesUseCase(repo)
        await use_case.execute(ids)

        repo.bulk_delete.assert_called_once_with(ids)
