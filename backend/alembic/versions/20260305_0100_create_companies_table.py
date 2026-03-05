"""Create companies table

Revision ID: 001_create_companies
Revises:
Create Date: 2026-03-05
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import UUID

revision: str = "001_create_companies"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "companies",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("street", sa.String(255), nullable=True),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("state", sa.String(100), nullable=True),
        sa.Column("zip_code", sa.String(20), nullable=True),
        sa.Column("country", sa.String(100), nullable=True),
        sa.Column("revenue", sa.Numeric(precision=15, scale=2), nullable=False, server_default="0"),
        sa.Column("expenses", sa.Numeric(precision=15, scale=2), nullable=False, server_default="0"),
        sa.Column("employees", sa.Integer, nullable=False, server_default="0"),
        sa.Column("clients", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
    )
    op.create_unique_constraint("uq_companies_name", "companies", ["name"])
    op.create_index("ix_companies_name", "companies", ["name"])


def downgrade() -> None:
    op.drop_index("ix_companies_name", table_name="companies")
    op.drop_constraint("uq_companies_name", "companies", type_="unique")
    op.drop_table("companies")
