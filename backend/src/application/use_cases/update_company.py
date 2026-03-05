from uuid import UUID

from sqlalchemy.exc import IntegrityError

from src.application.dtos.company import CompanyInput, CompanyOutput
from src.domain.exceptions import ConflictError, NotFoundError
from src.domain.repositories.company_repository import CompanyRepository


class UpdateCompanyUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, company_id: UUID, data: CompanyInput) -> CompanyOutput:
        company = await self._repo.find_by_id(company_id)
        if company is None:
            raise NotFoundError(f"Company {company_id} not found")

        company.name = data.name
        company.street = data.street
        company.city = data.city
        company.state = data.state
        company.zip_code = data.zip_code
        company.country = data.country
        company.revenue = data.revenue
        company.expenses = data.expenses
        company.employees = data.employees
        company.clients = data.clients

        try:
            updated = await self._repo.update(company)
        except IntegrityError:
            raise ConflictError(f"Company with name '{data.name}' already exists")
        return CompanyOutput.from_entity(updated)
