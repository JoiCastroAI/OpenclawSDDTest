from uuid import UUID

from src.application.dtos.company import CompanyOutput
from src.domain.exceptions import NotFoundError
from src.domain.repositories.company_repository import CompanyRepository


class GetCompanyUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, company_id: UUID) -> CompanyOutput:
        company = await self._repo.find_by_id(company_id)
        if company is None:
            raise NotFoundError(f"Company {company_id} not found")
        return CompanyOutput.from_entity(company)
