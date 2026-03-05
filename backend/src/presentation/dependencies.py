from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.bulk_delete_companies import BulkDeleteCompaniesUseCase
from src.application.use_cases.create_company import CreateCompanyUseCase
from src.application.use_cases.delete_company import DeleteCompanyUseCase
from src.application.use_cases.get_company import GetCompanyUseCase
from src.application.use_cases.list_companies import ListCompaniesUseCase
from src.application.use_cases.update_company import UpdateCompanyUseCase
from src.domain.repositories.company_repository import CompanyRepository
from src.infrastructure.database.repositories.company_repo import SQLAlchemyCompanyRepository
from src.infrastructure.database.session import get_session


def get_company_repository(
    session: AsyncSession = Depends(get_session),
) -> CompanyRepository:
    return SQLAlchemyCompanyRepository(session)


def get_list_companies_use_case(
    repo: CompanyRepository = Depends(get_company_repository),
) -> ListCompaniesUseCase:
    return ListCompaniesUseCase(repo)


def get_company_use_case(
    repo: CompanyRepository = Depends(get_company_repository),
) -> GetCompanyUseCase:
    return GetCompanyUseCase(repo)


def get_create_company_use_case(
    repo: CompanyRepository = Depends(get_company_repository),
) -> CreateCompanyUseCase:
    return CreateCompanyUseCase(repo)


def get_update_company_use_case(
    repo: CompanyRepository = Depends(get_company_repository),
) -> UpdateCompanyUseCase:
    return UpdateCompanyUseCase(repo)


def get_delete_company_use_case(
    repo: CompanyRepository = Depends(get_company_repository),
) -> DeleteCompanyUseCase:
    return DeleteCompanyUseCase(repo)


def get_bulk_delete_companies_use_case(
    repo: CompanyRepository = Depends(get_company_repository),
) -> BulkDeleteCompaniesUseCase:
    return BulkDeleteCompaniesUseCase(repo)
