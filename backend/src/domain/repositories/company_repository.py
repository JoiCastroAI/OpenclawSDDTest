from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.company import Company


class CompanyRepository(ABC):
    @abstractmethod
    async def find_all(self, offset: int = 0, limit: int = 50) -> list[Company]: ...

    @abstractmethod
    async def find_by_id(self, company_id: UUID) -> Company | None: ...

    @abstractmethod
    async def save(self, company: Company) -> Company: ...

    @abstractmethod
    async def update(self, company: Company) -> Company: ...

    @abstractmethod
    async def delete(self, company_id: UUID) -> None: ...

    @abstractmethod
    async def bulk_delete(self, ids: list[UUID]) -> None: ...

    @abstractmethod
    async def count(self) -> int: ...
