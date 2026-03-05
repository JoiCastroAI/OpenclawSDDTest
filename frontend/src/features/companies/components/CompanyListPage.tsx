import { type FC, useCallback, useMemo, useState } from 'react';
import { Button, Container, Form, Spinner, Alert, Table } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useListCompaniesQuery } from '../companiesApi';
import {
  toggleSelection,
  selectAll,
  clearSelection,
  openCreateModal,
  openEditModal,
  openDeleteConfirm,
} from '../companiesSlice';
import type { Company } from '../types';
import CompanyFormModal from './CompanyFormModal';
import CompanyDeleteConfirmation from './CompanyDeleteConfirmation';

const PAGE_SIZE = 50;

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value}`;
};

const CompanyListPage: FC = () => {
  const dispatch = useAppDispatch();
  const { selectedIds, isFormModalOpen, isDeleteConfirmOpen } = useAppSelector(
    (state) => state.companies,
  );

  const [page, setPage] = useState(0);
  const offset = page * PAGE_SIZE;

  const { data, isLoading, error } = useListCompaniesQuery({ offset, limit: PAGE_SIZE });

  const allSelected = useMemo(() => {
    if (!data?.items.length) return false;
    return data.items.every((c) => selectedIds.includes(c.id));
  }, [data, selectedIds]);

  const handleToggleAll = useCallback(() => {
    if (!data?.items) return;
    if (allSelected) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAll(data.items.map((c) => c.id)));
    }
  }, [data, allSelected, dispatch]);

  const handleToggleRow = useCallback(
    (id: string) => {
      dispatch(toggleSelection(id));
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (id: string) => {
      dispatch(openEditModal(id));
    },
    [dispatch],
  );

  const handleDeleteSingle = useCallback(
    (id: string) => {
      dispatch(clearSelection());
      dispatch(toggleSelection(id));
      dispatch(openDeleteConfirm());
    },
    [dispatch],
  );

  const handleBulkDelete = useCallback(() => {
    dispatch(openDeleteConfirm());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Failed to load companies.</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-4">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="h4 fw-medium mb-1">Companies</h1>
          <p className="text-muted mb-0">Manage all companies registered in the system</p>
        </div>
        <Button
          variant="success"
          className="d-flex align-items-center gap-2"
          onClick={() => dispatch(openCreateModal())}
          data-testid="add-company-btn"
        >
          + New Company
        </Button>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-3">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleBulkDelete}
            data-testid="bulk-delete-btn"
          >
            Delete Selected ({selectedIds.length})
          </Button>
        </div>
      )}

      {!data?.items.length ? (
        <Alert variant="info" data-testid="empty-state">
          No companies found.
        </Alert>
      ) : (
        <>
          <div className="border rounded">
            <Table hover responsive className="mb-0" data-testid="companies-table">
              <thead className="bg-light">
                <tr>
                  <th style={{ width: 50 }}>
                    <Form.Check
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleToggleAll}
                      aria-label="Select all companies"
                      data-testid="select-all-checkbox"
                    />
                  </th>
                  <th>Name</th>
                  <th>Address</th>
                  <th className="text-end">Revenue</th>
                  <th className="text-end">Expenses</th>
                  <th className="text-end">Profit</th>
                  <th className="text-end">Employees</th>
                  <th className="text-end">Clients</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((company: Company) => (
                  <tr key={company.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(company.id)}
                        onChange={() => handleToggleRow(company.id)}
                        aria-label={`Select ${company.name}`}
                      />
                    </td>
                    <td>{company.name}</td>
                    <td className="text-muted">
                      {[company.city, company.state].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="text-end">{formatCurrency(company.revenue)}</td>
                    <td className="text-end">{formatCurrency(company.expenses)}</td>
                    <td className="text-end text-success">{formatCurrency(company.profit)}</td>
                    <td className="text-end">{company.employees}</td>
                    <td className="text-end">{company.clients}</td>
                    <td className="text-end">
                      <Button
                        variant="link"
                        size="sm"
                        className="p-1"
                        onClick={() => handleEdit(company.id)}
                        aria-label={`Edit ${company.name}`}
                        data-testid={`edit-btn-${company.id}`}
                      >
                        &#9998;
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-1 text-danger"
                        onClick={() => handleDeleteSingle(company.id)}
                        aria-label={`Delete ${company.name}`}
                        data-testid={`delete-btn-${company.id}`}
                      >
                        &#128465;
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <p className="text-muted mt-3">
            Showing {data.items.length} of {data.total} companies
          </p>

          {data.total > PAGE_SIZE && (
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={offset + PAGE_SIZE >= data.total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {isFormModalOpen && <CompanyFormModal />}
      {isDeleteConfirmOpen && <CompanyDeleteConfirmation />}
    </Container>
  );
};

export default CompanyListPage;
