import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompanyDeleteConfirmation from './CompanyDeleteConfirmation';
import { renderWithProviders } from '../../../test/renderWithProviders';

const mockDeleteCompany = vi.fn();
const mockBulkDelete = vi.fn();

vi.mock('../companiesApi', () => ({
  useDeleteCompanyMutation: () => [
    mockDeleteCompany,
    { isLoading: false },
  ],
  useBulkDeleteCompaniesMutation: () => [
    mockBulkDelete,
    { isLoading: false },
  ],
}));

describe('CompanyDeleteConfirmation — Single Delete', () => {
  const singleDeleteState = {
    companies: {
      selectedIds: ['c1'],
      isFormModalOpen: false,
      editingCompanyId: null,
      isDeleteConfirmOpen: true,
    },
  };

  beforeEach(() => {
    mockDeleteCompany.mockReturnValue({ unwrap: () => Promise.resolve() });
    mockBulkDelete.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  it('renders confirmation dialog', () => {
    renderWithProviders(<CompanyDeleteConfirmation />, { preloadedState: singleDeleteState });
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
  });

  it('shows single delete message', () => {
    renderWithProviders(<CompanyDeleteConfirmation />, { preloadedState: singleDeleteState });
    expect(
      screen.getByText('Are you sure you want to delete this company? This action cannot be undone.'),
    ).toBeInTheDocument();
  });

  it('has Cancel and Delete buttons', () => {
    renderWithProviders(<CompanyDeleteConfirmation />, { preloadedState: singleDeleteState });
    expect(screen.getByTestId('cancel-delete-btn')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete-btn')).toHaveTextContent('Delete');
  });

  it('closes on Cancel click', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<CompanyDeleteConfirmation />, {
      preloadedState: singleDeleteState,
    });

    await user.click(screen.getByTestId('cancel-delete-btn'));

    await waitFor(() => {
      const state = store.getState() as { companies: { isDeleteConfirmOpen: boolean } };
      expect(state.companies.isDeleteConfirmOpen).toBe(false);
    });
  });

  it('deletes and clears selection on confirm', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<CompanyDeleteConfirmation />, {
      preloadedState: singleDeleteState,
    });

    await user.click(screen.getByTestId('confirm-delete-btn'));

    await waitFor(() => {
      expect(mockDeleteCompany).toHaveBeenCalledWith('c1');
      const state = store.getState() as {
        companies: { selectedIds: string[]; isDeleteConfirmOpen: boolean };
      };
      expect(state.companies.selectedIds).toEqual([]);
      expect(state.companies.isDeleteConfirmOpen).toBe(false);
    });
  });
});

describe('CompanyDeleteConfirmation — Bulk Delete', () => {
  const bulkDeleteState = {
    companies: {
      selectedIds: ['c1', 'c2', 'c3'],
      isFormModalOpen: false,
      editingCompanyId: null,
      isDeleteConfirmOpen: true,
    },
  };

  beforeEach(() => {
    mockDeleteCompany.mockReturnValue({ unwrap: () => Promise.resolve() });
    mockBulkDelete.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  it('shows bulk delete message with count', () => {
    renderWithProviders(<CompanyDeleteConfirmation />, { preloadedState: bulkDeleteState });
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/selected/)).toBeInTheDocument();
    expect(screen.getByText(/companies/)).toBeInTheDocument();
  });

  it('calls bulk delete on confirm', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<CompanyDeleteConfirmation />, {
      preloadedState: bulkDeleteState,
    });

    await user.click(screen.getByTestId('confirm-delete-btn'));

    await waitFor(() => {
      expect(mockBulkDelete).toHaveBeenCalledWith(['c1', 'c2', 'c3']);
      const state = store.getState() as {
        companies: { selectedIds: string[]; isDeleteConfirmOpen: boolean };
      };
      expect(state.companies.selectedIds).toEqual([]);
      expect(state.companies.isDeleteConfirmOpen).toBe(false);
    });
  });
});
