from sqlalchemy.exc import IntegrityError

from src.application.dtos.company import CompanyInput, CompanyOutput
from src.domain.entities.company import Company
from src.domain.exceptions import ConflictError
from src.domain.repositories.company_repository import CompanyRepository


class CreateCompanyUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, data: CompanyInput) -> CompanyOutput:
        company = Company(
            name=data.name,
            street=data.street,
            city=data.city,
            state=data.state,
            zip_code=data.zip_code,
            country=data.country,
            revenue=data.revenue,
            expenses=data.expenses,
            employees=data.employees,
            clients=data.clients,
        )
        try:
            saved = await self._repo.save(company)
        except IntegrityError:
            raise ConflictError(f"Company with name '{data.name}' already exists")
        return CompanyOutput.from_entity(saved)
