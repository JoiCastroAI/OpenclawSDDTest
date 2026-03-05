from uuid import UUID

from fastapi import APIRouter, Depends, status

from src.application.dtos.company import CompanyInput
from src.application.use_cases.bulk_delete_companies import BulkDeleteCompaniesUseCase
from src.application.use_cases.create_company import CreateCompanyUseCase
from src.application.use_cases.delete_company import DeleteCompanyUseCase
from src.application.use_cases.get_company import GetCompanyUseCase
from src.application.use_cases.list_companies import ListCompaniesUseCase
from src.application.use_cases.update_company import UpdateCompanyUseCase
from src.presentation.dependencies import (
    get_bulk_delete_companies_use_case,
    get_create_company_use_case,
    get_delete_company_use_case,
    get_company_use_case,
    get_list_companies_use_case,
    get_update_company_use_case,
)
from src.presentation.schemas.company import (
    BulkDeleteRequest,
    CompanyCreate,
    CompanyResponse,
    CompanyUpdate,
)
from src.presentation.schemas.pagination import PaginatedResponse

router = APIRouter(prefix="/api/v1/companies", tags=["companies"])


@router.get("/", response_model=PaginatedResponse[CompanyResponse])
async def list_companies(
    offset: int = 0,
    limit: int = 50,
    use_case: ListCompaniesUseCase = Depends(get_list_companies_use_case),
) -> PaginatedResponse[CompanyResponse]:
    return await use_case.execute(offset=offset, limit=limit)


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: UUID,
    use_case: GetCompanyUseCase = Depends(get_company_use_case),
) -> CompanyResponse:
    return await use_case.execute(company_id)


@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    data: CompanyCreate,
    use_case: CreateCompanyUseCase = Depends(get_create_company_use_case),
) -> CompanyResponse:
    company_input = CompanyInput(**data.model_dump())
    return await use_case.execute(company_input)


@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: UUID,
    data: CompanyUpdate,
    use_case: UpdateCompanyUseCase = Depends(get_update_company_use_case),
) -> CompanyResponse:
    company_input = CompanyInput(**data.model_dump())
    return await use_case.execute(company_id, company_input)


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(
    company_id: UUID,
    use_case: DeleteCompanyUseCase = Depends(get_delete_company_use_case),
) -> None:
    await use_case.execute(company_id)


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def bulk_delete_companies(
    data: BulkDeleteRequest,
    use_case: BulkDeleteCompaniesUseCase = Depends(get_bulk_delete_companies_use_case),
) -> None:
    await use_case.execute(data.ids)
