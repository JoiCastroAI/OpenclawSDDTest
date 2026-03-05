## ADDED Requirements

### Requirement: Companies feature module structure
The system SHALL provide a feature module at `frontend/src/features/companies/` containing `types.ts`, `companiesApi.ts`, `companiesSlice.ts`, and a `components/` directory, following the established feature-based architecture.

#### Scenario: Module exports
- **WHEN** the companies feature module is imported
- **THEN** it SHALL export all public types, API hooks, slice actions, and components via a barrel export

### Requirement: Company TypeScript types
The system SHALL define TypeScript types in `types.ts`: `Company` (with `id`, `name`, `industry`, `website`, `createdAt`, `updatedAt`), `CompanyCreate` (with `name`, `industry?`, `website?`), and `CompanyUpdate` (with `name?`, `industry?`, `website?`).

#### Scenario: Company type structure
- **WHEN** a `Company` object is used in the application
- **THEN** it SHALL have all fields typed: `id: string`, `name: string`, `industry: string | null`, `website: string | null`, `createdAt: string`, `updatedAt: string`

### Requirement: RTK Query endpoints for companies
The system SHALL define RTK Query endpoints in `companiesApi.ts`: `listCompanies` (query, paginated), `getCompany` (query), `createCompany` (mutation), `updateCompany` (mutation), `deleteCompany` (mutation), `bulkDeleteCompanies` (mutation). The `"Company"` tag type SHALL be added to the base API for cache invalidation.

#### Scenario: Listing companies triggers cache tag
- **WHEN** `useListCompaniesQuery` is called
- **THEN** the result SHALL provide the `"Company"` cache tag so mutations invalidate it

#### Scenario: Creating a company invalidates list cache
- **WHEN** `useCreateCompanyMutation` succeeds
- **THEN** the `"Company"` cache tag SHALL be invalidated, triggering a refetch of the companies list

#### Scenario: Bulk deleting companies invalidates list cache
- **WHEN** `useBulkDeleteCompaniesMutation` succeeds with a list of IDs
- **THEN** the `"Company"` cache tag SHALL be invalidated

### Requirement: Redux slice for companies UI state
The system SHALL define a `companiesSlice` in `companiesSlice.ts` managing UI-only state: `selectedIds` (array of selected company IDs for bulk actions), `isFormModalOpen` (boolean), `editingCompanyId` (string | null), and `isDeleteConfirmOpen` (boolean). Server data SHALL NOT be duplicated into the slice.

#### Scenario: Selecting companies for bulk action
- **WHEN** the `toggleSelection` action is dispatched with a company ID
- **THEN** the ID SHALL be added to `selectedIds` if not present, or removed if already present

#### Scenario: Opening form modal for editing
- **WHEN** the `openEditModal` action is dispatched with a company ID
- **THEN** `isFormModalOpen` SHALL be `true` and `editingCompanyId` SHALL be set to the provided ID

#### Scenario: Clearing selection after bulk delete
- **WHEN** the `clearSelection` action is dispatched
- **THEN** `selectedIds` SHALL be an empty array

### Requirement: CompanyListPage component
The system SHALL render a `CompanyListPage` component at the `/companies` route displaying a paginated table of companies with bulk selection checkboxes, action buttons (create, edit, delete), and pagination controls. The layout SHALL match Figma designs.

#### Scenario: Displaying companies in a table
- **WHEN** the companies list page is loaded and companies exist
- **THEN** a table SHALL display company data with columns matching the Figma design, with a checkbox in each row for bulk selection

#### Scenario: Empty state
- **WHEN** the companies list page is loaded and no companies exist
- **THEN** an empty state message SHALL be displayed indicating no companies are available

#### Scenario: Loading state
- **WHEN** the companies list page is loading data
- **THEN** a loading indicator SHALL be displayed

#### Scenario: Error state
- **WHEN** the companies list API request fails
- **THEN** an error message SHALL be displayed to the user

#### Scenario: Paginating through companies
- **WHEN** the user clicks a pagination control
- **THEN** the table SHALL update to show the corresponding page of results

#### Scenario: Selecting all companies on current page
- **WHEN** the user clicks the header checkbox
- **THEN** all companies on the current page SHALL be added to `selectedIds`

#### Scenario: Triggering bulk delete
- **WHEN** the user selects one or more companies and clicks the bulk delete button
- **THEN** the delete confirmation dialog SHALL open

### Requirement: CompanyFormModal component
The system SHALL render a `CompanyFormModal` component as a React Bootstrap `Modal` for both creating and editing companies. The form SHALL include fields for `name` (required), `industry` (optional), and `website` (optional) with client-side validation. The modal layout SHALL match Figma designs.

#### Scenario: Opening modal for creating a new company
- **WHEN** the user clicks the "Create" button on the list page
- **THEN** the modal SHALL open with empty form fields and a "Create" submit button

#### Scenario: Opening modal for editing an existing company
- **WHEN** the user clicks the "Edit" action on a company row
- **THEN** the modal SHALL open with form fields pre-populated with the company's current data and an "Update" submit button

#### Scenario: Submitting a valid create form
- **WHEN** the user fills in the required `name` field and submits
- **THEN** the `createCompany` mutation SHALL be called and the modal SHALL close on success

#### Scenario: Submitting a valid edit form
- **WHEN** the user modifies fields and submits the edit form
- **THEN** the `updateCompany` mutation SHALL be called and the modal SHALL close on success

#### Scenario: Validation error on empty name
- **WHEN** the user attempts to submit the form without a `name`
- **THEN** a validation error message SHALL be displayed and the form SHALL NOT submit

#### Scenario: Server error on duplicate name
- **WHEN** the mutation returns a 409 Conflict error
- **THEN** an error message SHALL be displayed in the modal indicating the name is already taken

### Requirement: CompanyDeleteConfirmation component
The system SHALL render a `CompanyDeleteConfirmation` component as a React Bootstrap confirmation dialog for both single and bulk delete operations. The dialog layout SHALL match Figma designs.

#### Scenario: Confirming single company deletion
- **WHEN** the user clicks "Delete" on a single company and confirms in the dialog
- **THEN** the `deleteCompany` mutation SHALL be called and the dialog SHALL close on success

#### Scenario: Confirming bulk company deletion
- **WHEN** the user has selected multiple companies, clicks bulk delete, and confirms
- **THEN** the `bulkDeleteCompanies` mutation SHALL be called with all selected IDs and the dialog SHALL close on success

#### Scenario: Cancelling deletion
- **WHEN** the user clicks "Cancel" in the delete confirmation dialog
- **THEN** no deletion SHALL occur and the dialog SHALL close

### Requirement: Companies route registration
The system SHALL register a lazy-loaded route at `/companies` in `AppRouter.tsx`, nested under the existing `Layout` element, rendering the `CompanyListPage` component.

#### Scenario: Navigating to companies route
- **WHEN** the user navigates to `/companies`
- **THEN** the `CompanyListPage` component SHALL be rendered within the application layout

#### Scenario: Lazy loading the companies module
- **WHEN** the `/companies` route is first accessed
- **THEN** the companies feature module SHALL be loaded via dynamic import (`React.lazy`)

### Requirement: Store configuration for companies
The system SHALL add the `companiesSlice` reducer to the Redux store configuration and add `"Company"` to the RTK Query base API `tagTypes`.

#### Scenario: Companies reducer in store
- **WHEN** the Redux store is initialized
- **THEN** the `companies` slice SHALL be present in the store state

#### Scenario: Company tag type in base API
- **WHEN** RTK Query base API is configured
- **THEN** `"Company"` SHALL be included in the `tagTypes` array

### Requirement: Responsive layout matching Figma
The system SHALL implement the companies UI with responsive layout using React Bootstrap grid and components, matching the visual design from Figma. The exact layout, spacing, and component arrangement SHALL follow the Figma nodes referenced in the design.

#### Scenario: Desktop layout
- **WHEN** the companies page is viewed on a desktop viewport
- **THEN** the layout SHALL match the Figma design for the main companies view

#### Scenario: Mobile responsive behavior
- **WHEN** the companies page is viewed on a narrow viewport
- **THEN** the layout SHALL adapt responsively using React Bootstrap's grid system

### Design References

UI implementation must follow the Figma designs. Referenced nodes:
- Main layout: https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-3
- Companies table view: https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-549
- Create/edit modal: https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-1230
- Delete confirmation: https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-1675
