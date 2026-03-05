## ADDED Requirements

### Requirement: Company domain entity
The system SHALL provide a `Company` domain entity as a Python dataclass with the following fields: `id` (UUID, primary key), `name` (str, required, max 255 chars, unique), `industry` (str | None, max 100 chars), `website` (str | None, URL format), `created_at` (datetime, auto-set), `updated_at` (datetime, auto-set).

#### Scenario: Entity instantiation with all fields
- **WHEN** a `Company` dataclass is instantiated with `id`, `name`, `industry`, `website`, `created_at`, and `updated_at`
- **THEN** all fields SHALL be stored with their provided values

#### Scenario: Entity instantiation with optional fields omitted
- **WHEN** a `Company` dataclass is instantiated with only `id`, `name`, `created_at`, and `updated_at`
- **THEN** `industry` and `website` SHALL default to `None`

### Requirement: Company repository interface
The system SHALL define an abstract `CompanyRepository` interface in the domain layer with methods: `find_all(offset, limit)`, `find_by_id(id)`, `save(company)`, `update(company)`, `delete(id)`, `bulk_delete(ids)`, and `count()`.

#### Scenario: Repository interface contract
- **WHEN** a concrete repository implementation is created
- **THEN** it SHALL implement all methods defined in the `CompanyRepository` abstract base class

### Requirement: SQLAlchemy repository implementation
The system SHALL provide a `SQLAlchemyCompanyRepository` that implements `CompanyRepository` using SQLAlchemy ORM, mapping to the `companies` table via `CompanyModel`.

#### Scenario: Persisting a new company
- **WHEN** `save` is called with a valid `Company` entity
- **THEN** a new row SHALL be inserted into the `companies` table and the persisted entity SHALL be returned

#### Scenario: Finding a company by ID
- **WHEN** `find_by_id` is called with an existing company ID
- **THEN** the corresponding `Company` entity SHALL be returned

#### Scenario: Finding a company by non-existent ID
- **WHEN** `find_by_id` is called with an ID that does not exist
- **THEN** `None` SHALL be returned

#### Scenario: Listing companies with pagination
- **WHEN** `find_all` is called with `offset=10` and `limit=5`
- **THEN** up to 5 companies SHALL be returned starting from the 11th record

#### Scenario: Bulk deleting companies
- **WHEN** `bulk_delete` is called with a list of company IDs
- **THEN** all companies matching those IDs SHALL be deleted from the database

### Requirement: Company ORM model and migration
The system SHALL define a `CompanyModel` SQLAlchemy ORM model in the shared `models.py` file mapping to a `companies` table. An Alembic migration SHALL create this table with all columns, a unique constraint on `name`, and appropriate indexes.

#### Scenario: Database table creation
- **WHEN** the Alembic migration is applied
- **THEN** a `companies` table SHALL exist with columns `id` (UUID PK), `name` (VARCHAR 255, NOT NULL, UNIQUE), `industry` (VARCHAR 100, NULLABLE), `website` (TEXT, NULLABLE), `created_at` (TIMESTAMP, NOT NULL), `updated_at` (TIMESTAMP, NOT NULL)

### Requirement: List companies endpoint
The system SHALL expose `GET /api/v1/companies` returning a paginated list of companies using the `PaginatedResponse[CompanyResponse]` envelope. It SHALL accept `offset` and `limit` query parameters.

#### Scenario: Listing companies with default pagination
- **WHEN** a GET request is sent to `/api/v1/companies` without pagination parameters
- **THEN** the response SHALL return status 200 with the first page of companies in a `PaginatedResponse` envelope

#### Scenario: Listing companies with custom pagination
- **WHEN** a GET request is sent to `/api/v1/companies?offset=10&limit=5`
- **THEN** the response SHALL return status 200 with up to 5 companies starting from offset 10

### Requirement: Get single company endpoint
The system SHALL expose `GET /api/v1/companies/{id}` returning a single company by ID.

#### Scenario: Getting an existing company
- **WHEN** a GET request is sent to `/api/v1/companies/{id}` with a valid existing ID
- **THEN** the response SHALL return status 200 with the company data as `CompanyResponse`

#### Scenario: Getting a non-existent company
- **WHEN** a GET request is sent to `/api/v1/companies/{id}` with an ID that does not exist
- **THEN** the response SHALL return status 404

### Requirement: Create company endpoint
The system SHALL expose `POST /api/v1/companies` accepting a `CompanyCreate` request body and returning the created company.

#### Scenario: Creating a company with valid data
- **WHEN** a POST request is sent to `/api/v1/companies` with `{"name": "Acme Corp", "industry": "Technology", "website": "https://acme.com"}`
- **THEN** the response SHALL return status 201 with the created company including a generated `id`, `created_at`, and `updated_at`

#### Scenario: Creating a company with duplicate name
- **WHEN** a POST request is sent to `/api/v1/companies` with a `name` that already exists
- **THEN** the response SHALL return status 409 (Conflict)

#### Scenario: Creating a company with missing required fields
- **WHEN** a POST request is sent to `/api/v1/companies` without the `name` field
- **THEN** the response SHALL return status 422 (Validation Error)

### Requirement: Update company endpoint
The system SHALL expose `PUT /api/v1/companies/{id}` accepting a `CompanyUpdate` request body and returning the updated company.

#### Scenario: Updating an existing company
- **WHEN** a PUT request is sent to `/api/v1/companies/{id}` with valid update data
- **THEN** the response SHALL return status 200 with the updated company and `updated_at` SHALL be refreshed

#### Scenario: Updating a non-existent company
- **WHEN** a PUT request is sent to `/api/v1/companies/{id}` with an ID that does not exist
- **THEN** the response SHALL return status 404

#### Scenario: Updating a company name to a duplicate
- **WHEN** a PUT request is sent to `/api/v1/companies/{id}` with a `name` that belongs to another company
- **THEN** the response SHALL return status 409 (Conflict)

### Requirement: Delete single company endpoint
The system SHALL expose `DELETE /api/v1/companies/{id}` to delete a single company.

#### Scenario: Deleting an existing company
- **WHEN** a DELETE request is sent to `/api/v1/companies/{id}` with a valid existing ID
- **THEN** the response SHALL return status 204 and the company SHALL be removed from the database

#### Scenario: Deleting a non-existent company
- **WHEN** a DELETE request is sent to `/api/v1/companies/{id}` with an ID that does not exist
- **THEN** the response SHALL return status 404

### Requirement: Bulk delete companies endpoint
The system SHALL expose `DELETE /api/v1/companies` accepting a JSON body `{"ids": [uuid, ...]}` to delete multiple companies in one operation.

#### Scenario: Bulk deleting existing companies
- **WHEN** a DELETE request is sent to `/api/v1/companies` with `{"ids": ["uuid1", "uuid2"]}`
- **THEN** the response SHALL return status 204 and all specified companies SHALL be removed

#### Scenario: Bulk deleting with empty list
- **WHEN** a DELETE request is sent to `/api/v1/companies` with `{"ids": []}`
- **THEN** the response SHALL return status 422 (Validation Error)

### Requirement: Use cases for company operations
The system SHALL implement one use case class per operation: `ListCompaniesUseCase`, `GetCompanyUseCase`, `CreateCompanyUseCase`, `UpdateCompanyUseCase`, `DeleteCompanyUseCase`, `BulkDeleteCompaniesUseCase`. Each SHALL have a single public `execute` method.

#### Scenario: ListCompaniesUseCase execution
- **WHEN** `ListCompaniesUseCase.execute` is called with offset and limit
- **THEN** it SHALL return a paginated list of companies and a total count via the repository

#### Scenario: CreateCompanyUseCase with duplicate name
- **WHEN** `CreateCompanyUseCase.execute` is called and the repository raises `IntegrityError`
- **THEN** the use case SHALL raise `ConflictError`

#### Scenario: DeleteCompanyUseCase with non-existent ID
- **WHEN** `DeleteCompanyUseCase.execute` is called with an ID not found in the repository
- **THEN** the use case SHALL raise `NotFoundError`

### Requirement: Pydantic DTOs and schemas
The system SHALL define Pydantic DTOs (`CompanyInput`, `CompanyOutput`) in the application layer and request/response schemas (`CompanyCreate`, `CompanyUpdate`, `CompanyResponse`) in the presentation layer. `name` SHALL be validated for max length 255, `industry` for max length 100, and `website` for URL format when provided.

#### Scenario: Validation of name exceeding max length
- **WHEN** a `CompanyCreate` schema receives a `name` longer than 255 characters
- **THEN** a validation error SHALL be raised

#### Scenario: Validation of website with invalid URL format
- **WHEN** a `CompanyCreate` schema receives a `website` value that is not a valid URL
- **THEN** a validation error SHALL be raised

#### Scenario: Optional fields accept null
- **WHEN** a `CompanyCreate` schema receives `industry` and `website` as `null`
- **THEN** validation SHALL pass and the fields SHALL be `None`
