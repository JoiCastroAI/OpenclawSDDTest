<!-- BEGIN_ENRICHED_USER_STORY -->
# Enriched User Story

design-linked: true
scope:
  backend: true
  frontend: true
source: Notion
reference: https://www.notion.so/Companies-section-31a04e35e0538073ad71c7cc64e16cb6

## Title
Companies Section - Full CRUD with UI

## Problem / Context
The application needs a Companies management section. Users must be able to list, create, edit, and bulk-delete companies. The frontend view follows the provided Figma designs and connects to a new backend CRUD API for the Companies entity.

## Desired Outcome
- Companies listing displayed in a paginated table with bulk selection checkboxes
- Bulk delete action: select multiple companies and delete them in one operation
- Edit an existing company via a modal dialog
- Create a new company via a modal dialog
- Full CRUD REST API for the Companies resource:
  - `GET /api/v1/companies` (paginated list)
  - `GET /api/v1/companies/{id}` (single company)
  - `POST /api/v1/companies` (create)
  - `PUT /api/v1/companies/{id}` (update)
  - `DELETE /api/v1/companies/{id}` (delete single)
  - `DELETE /api/v1/companies` (bulk delete)

## Acceptance Criteria

### Backend
- [ ] `Company` domain entity created in `backend/src/domain/entities/company.py` with fields: `id` (UUID), `name` (str), `industry` (str | None), `website` (str | None), `created_at` (datetime), `updated_at` (datetime)
- [ ] `CompanyRepository` abstract interface in `backend/src/domain/repositories/company_repository.py` with methods: `find_all`, `find_by_id`, `save`, `update`, `delete`, `bulk_delete`, `count`
- [ ] `SQLAlchemyCompanyRepository` concrete implementation in `backend/src/infrastructure/database/repositories/company_repo.py`
- [ ] `CompanyModel` SQLAlchemy ORM model in `backend/src/infrastructure/database/models.py` mapping to `companies` table
- [ ] Alembic migration to create the `companies` table
- [ ] Use cases in `backend/src/application/use_cases/`: `ListCompaniesUseCase`, `GetCompanyUseCase`, `CreateCompanyUseCase`, `UpdateCompanyUseCase`, `DeleteCompanyUseCase`, `BulkDeleteCompaniesUseCase`
- [ ] Pydantic DTOs in `backend/src/application/dtos/company.py`: `CompanyInput`, `CompanyOutput`
- [ ] Pydantic request/response schemas in `backend/src/presentation/schemas/company.py`: `CompanyCreate`, `CompanyUpdate`, `CompanyResponse`
- [ ] FastAPI router in `backend/src/presentation/routers/companies.py` with all CRUD endpoints under `/api/v1/companies`
- [ ] Pagination using `PaginatedResponse[CompanyResponse]` envelope
- [ ] Bulk delete endpoint accepts a JSON body with a list of company IDs
- [ ] Unit tests for domain entity, use cases (mocked repos), and integration tests for API endpoints
- [ ] 80%+ line coverage on new code
- [ ] `api-spec.yml` updated with all new endpoints
- [ ] `data-model.md` updated with the Companies entity

### Frontend
- [ ] New feature module at `frontend/src/features/companies/` following project structure conventions
- [ ] TypeScript types in `frontend/src/features/companies/types.ts`: `Company`, `CompanyCreate`, `CompanyUpdate`
- [ ] RTK Query endpoints in `frontend/src/features/companies/companiesApi.ts`: `listCompanies`, `getCompany`, `createCompany`, `updateCompany`, `deleteCompany`, `bulkDeleteCompanies`
- [ ] Redux slice in `frontend/src/features/companies/companiesSlice.ts` for UI state (selected IDs, filters, modal open/close)
- [ ] `CompanyListPage` component: paginated table, bulk selection checkboxes, action buttons
- [ ] `CompanyFormModal` component: reusable modal for create and edit flows
- [ ] `CompanyDeleteConfirmation` component: confirmation dialog for single and bulk delete
- [ ] Empty state displayed when no companies exist
- [ ] Loading and error states handled per frontend standards
- [ ] Responsive layout matching Figma designs
- [ ] Route added at `/companies` in `AppRouter.tsx` (lazy loaded)
- [ ] `tagTypes: ["Company"]` added to RTK Query base API
- [ ] Store updated to include companies reducer
- [ ] Component tests with Vitest + React Testing Library
- [ ] Cypress e2e tests for list, create, edit, and delete workflows
- [ ] All components use React Bootstrap and follow accessibility standards

## Technical Notes

### Backend Architecture (Clean Architecture)
- **Domain layer**: `Company` entity (dataclass), `CompanyRepository` ABC
- **Application layer**: One use case class per operation, Pydantic DTOs for input/output
- **Infrastructure layer**: `CompanyModel` (SQLAlchemy), `SQLAlchemyCompanyRepository`, Alembic migration
- **Presentation layer**: FastAPI router, Pydantic request/response schemas, dependency injection via `Depends`

### Frontend Architecture (Feature-based)
- **Feature module**: `features/companies/` with components, slice, API, types, and barrel export
- **State**: RTK Query for server data, Redux slice for UI state (selected rows, modal visibility), `useState` for form inputs
- **Routing**: Lazy-loaded route at `/companies`
- **Styling**: React Bootstrap components, responsive grid

### Company Entity Fields
| Field       | Type           | Constraints                     |
|-------------|----------------|---------------------------------|
| id          | UUID           | Primary key, auto-generated     |
| name        | string         | Required, max 255 chars, unique |
| industry    | string \| null | Optional, max 100 chars         |
| website     | string \| null | Optional, valid URL format       |
| created_at  | datetime       | Auto-set on creation            |
| updated_at  | datetime       | Auto-set on update              |

> **Note**: The exact field set must be confirmed against the Figma designs during implementation. The design nodes should be inspected to determine the precise columns shown in the table and form fields in the modals.

## Design References

Figma File:
https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=0-1

Referenced Nodes:
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-3
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-549
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-1230
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-1675

## Constraints / Notes
- All code, comments, and messages must be in English
- Follow TDD: write failing tests first
- Backend branch suffix: `-backend`, frontend branch suffix: `-frontend`
- Documentation must be updated: `api-spec.yml`, `data-model.md`
<!-- END_ENRICHED_USER_STORY -->
