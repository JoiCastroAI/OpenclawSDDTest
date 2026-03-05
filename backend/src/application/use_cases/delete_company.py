from uuid import UUID

from src.domain.exceptions import NotFoundError
from src.domain.repositories.company_repository import CompanyRepository


class DeleteCompanyUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, company_id: UUID) -> None:
        company = await self._repo.find_by_id(company_id)
        if company is None:
            raise NotFoundError(f"Company {company_id} not found")
        await self._repo.delete(company_id)
