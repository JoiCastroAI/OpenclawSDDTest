"""Integration tests for the companies API endpoints.

These tests use the FastAPI test client (httpx AsyncClient)
and require a running test database.
"""

from uuid import uuid4

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestCompaniesAPI:
    async def test_list_companies_returns_200(self, client: AsyncClient) -> None:
        response = await client.get("/api/v1/companies")

        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "offset" in data
        assert "limit" in data

    async def test_create_company_returns_201(self, client: AsyncClient) -> None:
        payload = {
            "name": f"Test Corp {uuid4().hex[:8]}",
            "street": "123 Main St",
            "city": "San Francisco",
            "state": "CA",
            "zip_code": "94102",
            "country": "USA",
            "revenue": 5000000,
            "expenses": 3000000,
            "employees": 100,
            "clients": 50,
        }
        response = await client.post("/api/v1/companies", json=payload)

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == payload["name"]
        assert data["city"] == "San Francisco"
        assert data["revenue"] == "5000000"
        assert data["profit"] == "2000000"
        assert "id" in data
        assert "created_at" in data

    async def test_create_company_duplicate_name_returns_409(
        self, client: AsyncClient
    ) -> None:
        name = f"Unique Corp {uuid4().hex[:8]}"
        await client.post("/api/v1/companies", json={"name": name})

        response = await client.post("/api/v1/companies", json={"name": name})
        assert response.status_code == 409

    async def test_create_company_missing_name_returns_422(
        self, client: AsyncClient
    ) -> None:
        response = await client.post("/api/v1/companies", json={"city": "Boston"})
        assert response.status_code == 422

    async def test_get_company_returns_200(self, client: AsyncClient) -> None:
        create_resp = await client.post(
            "/api/v1/companies",
            json={"name": f"Get Test Corp {uuid4().hex[:8]}"},
        )
        company_id = create_resp.json()["id"]

        response = await client.get(f"/api/v1/companies/{company_id}")

        assert response.status_code == 200
        assert response.json()["id"] == company_id

    async def test_get_company_not_found_returns_404(self, client: AsyncClient) -> None:
        response = await client.get(f"/api/v1/companies/{uuid4()}")
        assert response.status_code == 404

    async def test_update_company_returns_200(self, client: AsyncClient) -> None:
        create_resp = await client.post(
            "/api/v1/companies",
            json={"name": f"Update Test Corp {uuid4().hex[:8]}"},
        )
        company_id = create_resp.json()["id"]

        response = await client.put(
            f"/api/v1/companies/{company_id}",
            json={
                "name": f"Updated Corp {uuid4().hex[:8]}",
                "city": "Boston",
                "revenue": 7000000,
                "expenses": 4000000,
            },
        )

        assert response.status_code == 200
        assert response.json()["city"] == "Boston"
        assert response.json()["profit"] == "3000000"

    async def test_update_company_not_found_returns_404(
        self, client: AsyncClient
    ) -> None:
        response = await client.put(
            f"/api/v1/companies/{uuid4()}",
            json={"name": "Does Not Matter"},
        )
        assert response.status_code == 404

    async def test_update_company_duplicate_name_returns_409(
        self, client: AsyncClient
    ) -> None:
        name1 = f"First Corp {uuid4().hex[:8]}"
        name2 = f"Second Corp {uuid4().hex[:8]}"
        await client.post("/api/v1/companies", json={"name": name1})
        create2 = await client.post("/api/v1/companies", json={"name": name2})
        company2_id = create2.json()["id"]

        response = await client.put(
            f"/api/v1/companies/{company2_id}",
            json={"name": name1},
        )
        assert response.status_code == 409

    async def test_delete_company_returns_204(self, client: AsyncClient) -> None:
        create_resp = await client.post(
            "/api/v1/companies",
            json={"name": f"Delete Test Corp {uuid4().hex[:8]}"},
        )
        company_id = create_resp.json()["id"]

        response = await client.delete(f"/api/v1/companies/{company_id}")
        assert response.status_code == 204

        get_resp = await client.get(f"/api/v1/companies/{company_id}")
        assert get_resp.status_code == 404

    async def test_delete_company_not_found_returns_404(
        self, client: AsyncClient
    ) -> None:
        response = await client.delete(f"/api/v1/companies/{uuid4()}")
        assert response.status_code == 404

    async def test_bulk_delete_returns_204(self, client: AsyncClient) -> None:
        c1 = await client.post(
            "/api/v1/companies",
            json={"name": f"Bulk Del 1 {uuid4().hex[:8]}"},
        )
        c2 = await client.post(
            "/api/v1/companies",
            json={"name": f"Bulk Del 2 {uuid4().hex[:8]}"},
        )

        response = await client.request(
            "DELETE",
            "/api/v1/companies",
            json={"ids": [c1.json()["id"], c2.json()["id"]]},
        )
        assert response.status_code == 204

    async def test_bulk_delete_empty_ids_returns_422(
        self, client: AsyncClient
    ) -> None:
        response = await client.request(
            "DELETE",
            "/api/v1/companies",
            json={"ids": []},
        )
        assert response.status_code == 422
