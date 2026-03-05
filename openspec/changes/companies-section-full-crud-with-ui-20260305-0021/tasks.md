## 1. Backend — Domain & Infrastructure

- [ ] 1.1 [BE] Create `Company` domain entity dataclass with fields: `id`, `name`, `industry`, `website`, `created_at`, `updated_at`
- [ ] 1.2 [BE] Define `CompanyRepository` abstract interface in the domain layer with methods: `find_all`, `find_by_id`, `save`, `update`, `delete`, `bulk_delete`, `count`
- [ ] 1.3 [BE] Add `CompanyModel` SQLAlchemy ORM model to `models.py` mapping to the `companies` table
- [ ] 1.4 [BE] Create Alembic migration for `companies` table with unique constraint on `name` and appropriate indexes
- [ ] 1.5 [BE] Implement `SQLAlchemyCompanyRepository` with all repository interface methods

## 2. Backend — Application Layer (Use Cases & DTOs)

- [ ] 2.1 [BE] Define Pydantic DTOs: `CompanyInput` and `CompanyOutput` in the application layer
- [ ] 2.2 [BE] Implement `ListCompaniesUseCase` (paginated list with count)
- [ ] 2.3 [BE] Implement `GetCompanyUseCase` (single company by ID, raise `NotFoundError` if missing)
- [ ] 2.4 [BE] Implement `CreateCompanyUseCase` (create company, catch `IntegrityError` → `ConflictError`)
- [ ] 2.5 [BE] Implement `UpdateCompanyUseCase` (update company, handle not found and duplicate name)
- [ ] 2.6 [BE] Implement `DeleteCompanyUseCase` (delete single, raise `NotFoundError` if missing)
- [ ] 2.7 [BE] Implement `BulkDeleteCompaniesUseCase` (bulk delete by list of IDs)

## 3. Backend — Presentation Layer (Router & Schemas)

- [ ] 3.1 [BE] Define request/response schemas: `CompanyCreate`, `CompanyUpdate`, `CompanyResponse`, `BulkDeleteRequest`
- [ ] 3.2 [BE] Implement companies router with all endpoints: `GET /` (list), `GET /{id}`, `POST /`, `PUT /{id}`, `DELETE /{id}`, `DELETE /` (bulk)
- [ ] 3.3 [BE] Register companies router in the FastAPI app and configure dependency injection for `CompanyRepository`

## 4. Backend — Documentation

- [ ] 4.1 [BE] Update `api-spec.yml` with all companies endpoints and schemas
- [ ] 4.2 [BE] Update `data-model.md` with the `companies` table definition

## 5. Backend — Tests

- [ ] 5.1 [TEST] Unit tests for `Company` domain entity
- [ ] 5.2 [TEST] Unit tests for all six use cases (happy paths and error cases: not found, conflict)
- [ ] 5.3 [TEST] Integration tests for `SQLAlchemyCompanyRepository` (CRUD + bulk delete + pagination)
- [ ] 5.4 [TEST] Integration tests for companies API endpoints (all status codes: 200, 201, 204, 404, 409, 422)

## 6. Frontend — Setup & State Management

- [ ] 6.1 [FE] Sync layout and components from Figma nodes (node-id=1-3, 1-549, 1-1230, 1-1675) — extract structure, spacing, and visual details via Live Design Mode
- [ ] 6.2 [FE] Create `types.ts` with `Company`, `CompanyCreate`, and `CompanyUpdate` TypeScript types
- [ ] 6.3 [FE] Add `"Company"` tag type to the RTK Query base API in `src/app/api.ts`
- [ ] 6.4 [FE] Create `companiesApi.ts` with RTK Query endpoints: `listCompanies`, `getCompany`, `createCompany`, `updateCompany`, `deleteCompany`, `bulkDeleteCompanies`
- [ ] 6.5 [FE] Create `companiesSlice.ts` with UI state: `selectedIds`, `isFormModalOpen`, `editingCompanyId`, `isDeleteConfirmOpen` and corresponding actions
- [ ] 6.6 [FE] Register `companiesSlice` reducer in the Redux store configuration

## 7. Frontend — Components (Figma-aligned via Live Design Mode)

- [ ] 7.1 [FE] Implement `CompanyListPage` component with paginated table, bulk selection checkboxes, action buttons, loading/empty/error states — matching Figma table view
- [ ] 7.2 [FE] Implement `CompanyFormModal` component for create and edit operations with client-side validation — matching Figma modal design
- [ ] 7.3 [FE] Implement `CompanyDeleteConfirmation` component for single and bulk delete — matching Figma confirmation dialog
- [ ] 7.4 [FE] Register lazy-loaded `/companies` route in `AppRouter.tsx` nested under `Layout`

## 8. Frontend — Tests

- [ ] 8.1 [TEST] Component tests for `CompanyListPage` (renders table, empty state, loading state, pagination, bulk selection)
- [ ] 8.2 [TEST] Component tests for `CompanyFormModal` (create mode, edit mode, validation errors, server errors)
- [ ] 8.3 [TEST] Component tests for `CompanyDeleteConfirmation` (single delete, bulk delete, cancel)
