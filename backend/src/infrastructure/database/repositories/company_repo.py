from uuid import UUID

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.company import Company
from src.domain.repositories.company_repository import CompanyRepository
from src.infrastructure.database.models import CompanyModel


class SQLAlchemyCompanyRepository(CompanyRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def find_all(self, offset: int = 0, limit: int = 50) -> list[Company]:
        stmt = select(CompanyModel).offset(offset).limit(limit).order_by(CompanyModel.created_at.desc())
        result = await self._session.execute(stmt)
        rows = result.scalars().all()
        return [self._to_entity(row) for row in rows]

    async def find_by_id(self, company_id: UUID) -> Company | None:
        stmt = select(CompanyModel).where(CompanyModel.id == company_id)
        result = await self._session.execute(stmt)
        row = result.scalar_one_or_none()
        return self._to_entity(row) if row else None

    async def save(self, company: Company) -> Company:
        model = CompanyModel(
            id=company.id,
            name=company.name,
            street=company.street,
            city=company.city,
            state=company.state,
            zip_code=company.zip_code,
            country=company.country,
            revenue=company.revenue,
            expenses=company.expenses,
            employees=company.employees,
            clients=company.clients,
        )
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return self._to_entity(model)

    async def update(self, company: Company) -> Company:
        stmt = select(CompanyModel).where(CompanyModel.id == company.id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        if model is None:
            raise ValueError(f"Company {company.id} not found")
        model.name = company.name
        model.street = company.street
        model.city = company.city
        model.state = company.state
        model.zip_code = company.zip_code
        model.country = company.country
        model.revenue = company.revenue
        model.expenses = company.expenses
        model.employees = company.employees
        model.clients = company.clients
        await self._session.commit()
        await self._session.refresh(model)
        return self._to_entity(model)

    async def delete(self, company_id: UUID) -> None:
        stmt = delete(CompanyModel).where(CompanyModel.id == company_id)
        await self._session.execute(stmt)
        await self._session.commit()

    async def bulk_delete(self, ids: list[UUID]) -> None:
        stmt = delete(CompanyModel).where(CompanyModel.id.in_(ids))
        await self._session.execute(stmt)
        await self._session.commit()

    async def count(self) -> int:
        stmt = select(func.count()).select_from(CompanyModel)
        result = await self._session.execute(stmt)
        return result.scalar_one()

    @staticmethod
    def _to_entity(model: CompanyModel) -> Company:
        return Company(
            id=model.id,
            name=model.name,
            street=model.street,
            city=model.city,
            state=model.state,
            zip_code=model.zip_code,
            country=model.country,
            revenue=model.revenue,
            expenses=model.expenses,
            employees=model.employees,
            clients=model.clients,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
