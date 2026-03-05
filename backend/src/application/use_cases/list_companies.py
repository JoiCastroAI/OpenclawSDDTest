from src.application.dtos.company import CompanyOutput
from src.domain.repositories.company_repository import CompanyRepository


class ListCompaniesUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(
        self, offset: int = 0, limit: int = 50
    ) -> dict:
        companies = await self._repo.find_all(offset=offset, limit=limit)
        total = await self._repo.count()
        return {
            "items": [CompanyOutput.from_entity(c) for c in companies],
            "total": total,
            "offset": offset,
            "limit": limit,
        }
