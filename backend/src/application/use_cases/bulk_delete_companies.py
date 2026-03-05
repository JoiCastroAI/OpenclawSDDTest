from uuid import UUID

from src.domain.repositories.company_repository import CompanyRepository


class BulkDeleteCompaniesUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, ids: list[UUID]) -> None:
        await self._repo.bulk_delete(ids)
