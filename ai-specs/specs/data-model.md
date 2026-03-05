# Data Model

## companies

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default `gen_random_uuid()` | Unique identifier |
| name | VARCHAR(255) | NOT NULL, UNIQUE, INDEXED | Company name |
| street | VARCHAR(255) | NULLABLE | Street address |
| city | VARCHAR(100) | NULLABLE | City |
| state | VARCHAR(100) | NULLABLE | State/Province |
| zip_code | VARCHAR(20) | NULLABLE | Postal/ZIP code |
| country | VARCHAR(100) | NULLABLE | Country |
| revenue | NUMERIC(15,2) | NOT NULL, default 0 | Total revenue |
| expenses | NUMERIC(15,2) | NOT NULL, default 0 | Total expenses |
| employees | INTEGER | NOT NULL, default 0 | Number of employees |
| clients | INTEGER | NOT NULL, default 0 | Number of clients |
| created_at | TIMESTAMP | NOT NULL, default `now()` | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, default `now()` | Last update timestamp |

**Computed field (application level):** `profit = revenue - expenses`

### Indexes

- `ix_companies_name` on `name`

### Constraints

- `uq_companies_name` UNIQUE on `name`
