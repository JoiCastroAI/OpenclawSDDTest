## Why

The application lacks a Companies management section. Users need the ability to list, create, edit, and bulk-delete companies through a dedicated UI backed by a CRUD API. This is a foundational entity module required for the business domain.

## What Changes

- New `Company` domain entity with full Clean Architecture layers (domain, application, infrastructure, presentation)
- New REST API under `/api/v1/companies` with endpoints for list (paginated), get, create, update, delete, and bulk delete
- Alembic migration to create the `companies` table
- New frontend feature module at `features/companies/` with paginated table, bulk selection, create/edit modals, and delete confirmation
- New lazy-loaded route at `/companies`
- RTK Query endpoints and Redux slice for companies state management
- Documentation updates to `api-spec.yml` and `data-model.md`

## Capabilities

### New Capabilities
- `companies-api`: Backend CRUD API for the Companies resource — domain entity, repository, use cases, DTOs, router, and database migration
- `companies-ui`: Frontend Companies section — paginated table with bulk actions, create/edit modal, delete confirmation, RTK Query integration, and responsive layout matching Figma designs

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **Backend**: New domain entity, repository, use cases, DTOs, schemas, router, and Alembic migration. New dependency injection bindings for `CompanyRepository`.
- **Frontend**: New feature module, new route in `AppRouter.tsx`, new RTK Query tag type `"Company"`, new reducer in store configuration.
- **APIs**: Six new endpoints under `/api/v1/companies` — `api-spec.yml` must be updated.
- **Database**: New `companies` table via Alembic migration — `data-model.md` must be updated.
- **Design**: UI must follow Figma designs. Node-id links are referenced in [Design References](../../drafts/enriched/_archived/companies-section-full-crud-with-ui-20260305-0021.md) and will be consulted during frontend implementation.
