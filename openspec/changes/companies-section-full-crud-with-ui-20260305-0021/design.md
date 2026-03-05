## Context

The application follows Clean Architecture (backend) and feature-based architecture (frontend). Existing modules like `candidates` and `positions` establish conventions for both stacks. The Companies section introduces a new foundational entity with full CRUD operations and a UI that must match Figma designs.

Current state:
- No `Company` entity, table, or API exists
- No frontend feature module for companies
- The `candidates` module serves as the canonical reference for both backend and frontend patterns
- RTK Query base API (`src/app/api.ts`) already supports tag-based cache invalidation

## Goals / Non-Goals

**Goals:**
- Implement a complete CRUD API for the Companies resource following existing Clean Architecture patterns
- Build a frontend Companies section with paginated table, bulk actions, and create/edit modals matching Figma designs
- Maintain consistency with existing modules (`candidates`) in code structure, naming, and patterns
- Update documentation (`api-spec.yml`, `data-model.md`) to reflect the new entity

**Non-Goals:**
- Company-to-company relationships or hierarchies
- Full-text search or advanced filtering beyond basic pagination
- Company logo/image uploads
- Multi-tenant isolation (companies belong to the global namespace)
- Authentication changes — existing `get_current_user` dependency is reused as-is

## Decisions

### D1: Domain Entity as Dataclass

**Decision:** Use a `@dataclass` for the `Company` entity, consistent with the `Candidate` entity pattern.

**Rationale:** Backend standards mandate plain Python dataclasses in the domain layer with zero external dependencies. This keeps the domain layer framework-agnostic.

**Alternatives considered:**
- Pydantic model as entity — rejected because it violates Clean Architecture (domain depends on Pydantic)
- Named tuple — rejected because entities need mutability for update operations

### D2: Company Fields

**Decision:** Fields are `id` (UUID), `name` (str, required, unique, max 255), `industry` (str | None, max 100), `website` (str | None, URL format), `created_at` (datetime), `updated_at` (datetime).

**Rationale:** Derived from the enriched user story. The exact visible fields in table and forms will be confirmed against Figma designs during frontend implementation.

**Alternatives considered:**
- Additional fields (address, phone, etc.) — deferred; the enriched spec defines only these fields. Figma inspection at apply time may reveal additional fields.

### D3: Bulk Delete via Request Body

**Decision:** `DELETE /api/v1/companies` accepts a JSON body `{ "ids": [uuid, ...] }` for bulk deletion.

**Rationale:** Using a request body with DELETE avoids URL length limitations from passing many UUIDs as query parameters. This matches the enriched spec's requirement for bulk delete.

**Alternatives considered:**
- `POST /api/v1/companies/bulk-delete` — rejected to keep REST conventions (DELETE for deletion). FastAPI supports request bodies on DELETE.
- Query parameter `?ids=uuid1,uuid2` — rejected due to URL length limits with many IDs

### D4: Pagination with Offset/Limit

**Decision:** Use offset/limit pagination with the existing `PaginatedResponse[T]` envelope, consistent with the `candidates` module.

**Rationale:** Backend standards define this as the standard pagination approach. The existing generic `PaginatedResponse` can be reused directly.

**Alternatives considered:**
- Cursor-based pagination — rejected for consistency; no existing module uses it

### D5: Single SQLAlchemy Models File

**Decision:** Add `CompanyModel` to the existing `backend/src/infrastructure/database/models.py` file.

**Rationale:** Backend standards show all ORM models in a single file. Following the existing pattern avoids unnecessary file proliferation.

**Alternatives considered:**
- Separate `company_model.py` — rejected for consistency with established pattern

### D6: One Use Case Per Operation

**Decision:** Six use case classes: `ListCompaniesUseCase`, `GetCompanyUseCase`, `CreateCompanyUseCase`, `UpdateCompanyUseCase`, `DeleteCompanyUseCase`, `BulkDeleteCompaniesUseCase`.

**Rationale:** Backend standards mandate one use case class with a single public `execute` method. Each CRUD operation + bulk delete gets its own class.

### D7: Frontend Feature Module Structure

**Decision:** Follow the established feature-based architecture at `frontend/src/features/companies/` with `types.ts`, `companiesApi.ts`, `companiesSlice.ts`, and a `components/` directory.

**Rationale:** Mirrors the `candidates` module structure defined in frontend standards.

### D8: RTK Query with Tag-Based Cache Invalidation

**Decision:** Add `"Company"` to `tagTypes` in the base API. Use `providesTags` / `invalidatesTags` for automatic list refresh after mutations.

**Rationale:** This is the established pattern in the codebase (see `candidates` example in frontend standards). Bulk delete invalidates the entire `"Company"` tag.

### D9: Redux Slice for UI State Only

**Decision:** `companiesSlice.ts` manages only UI state: selected IDs (for bulk actions), modal open/close, filters. Server data lives in RTK Query cache.

**Rationale:** Frontend standards explicitly state: "Never duplicate server data into slices. Let RTK Query own it."

### D10: React Bootstrap Components with Figma Alignment

**Decision:** Use React Bootstrap `Table`, `Modal`, `Form`, `Button`, `Alert` components. Layout and visual details must match Figma designs.

**Rationale:** Frontend standards mandate React Bootstrap. Figma designs are the visual source of truth.

### D11: Lazy-Loaded Route

**Decision:** Add `/companies` route in `AppRouter.tsx` using `React.lazy` and dynamic import, nested under the existing `Layout` element.

**Rationale:** Follows the established routing pattern for all feature pages (see `candidates`, `positions` in frontend standards).

### D12: Alembic Migration Strategy

**Decision:** Single Alembic migration to create the `companies` table with all columns, constraints (unique on `name`), and indexes.

**Rationale:** This is a new table with no dependencies on existing tables. A single migration is the simplest approach.

**Alternatives considered:**
- Multiple migrations (create table, then add indexes) — unnecessary complexity for a greenfield table

## Risks / Trade-offs

**[Risk] Figma design may reveal additional fields not in the enriched spec**
Mitigation: The entity field set is confirmed against Figma during frontend implementation. If extra fields appear, the backend entity/migration/DTOs will be extended before proceeding.

**[Risk] Bulk delete with large ID lists could cause long-running transactions**
Mitigation: For v1, this is acceptable. The UI will realistically select tens, not thousands, of companies. If needed later, batch processing can be added.

**[Risk] `name` uniqueness constraint may cause conflicts on concurrent creates**
Mitigation: The `ConflictError` domain exception and its 409 handler already exist. The use case will catch `IntegrityError` from SQLAlchemy and raise `ConflictError`.

**[Risk] DELETE with request body is not universally supported by all HTTP clients**
Mitigation: FastAPI handles it natively. The frontend uses RTK Query's `fetchBaseQuery` which supports it. No proxy or CDN restrictions apply in the current deployment.

**[Trade-off] Single `models.py` file grows with each new entity**
Accepted: Following the established pattern. Can be refactored to per-entity model files later if the file becomes unwieldy.

## Live Design Mode

Frontend implementation must consult Figma MCP at apply time to ensure UI components match the design. Referenced Figma nodes:
- Main layout: `node-id=1-3`
- Companies table view: `node-id=1-549`
- Create/edit modal: `node-id=1-1230`
- Delete confirmation: `node-id=1-1675`

Figma file: `GfsFFzSElzlbM9uhiNJ3jx`
