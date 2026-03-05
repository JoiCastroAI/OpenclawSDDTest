import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompanyListPage from './CompanyListPage';
import { renderWithProviders } from '../../../test/renderWithProviders';
import type { PaginatedResponse } from '../types';
import type { Company } from '../types';

const mockCompanies: Company[] = [
  {
    id: 'c1',
    name: 'Acme Corp',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    revenue: 5000000,
    expenses: 3000000,
    profit: 2000000,
    employees: 100,
    clients: 50,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c2',
    name: 'Beta Inc',
    street: null,
    city: 'San Francisco',
    state: 'CA',
    zipCode: null,
    country: null,
    revenue: 1000000,
    expenses: 800000,
    profit: 200000,
    employees: 25,
    clients: 10,
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
  },
];

type UseListCompaniesQueryReturn = {
  data?: PaginatedResponse<Company>;
  isLoading: boolean;
  error?: { status: number };
};

const mockUseListCompaniesQuery = vi.fn<() => UseListCompaniesQueryReturn>();

vi.mock('../companiesApi', () => ({
  useListCompaniesQuery: (...args: unknown[]) => mockUseListCompaniesQuery(...(args as [])),
}));

describe('CompanyListPage', () => {
  beforeEach(() => {
    mockUseListCompaniesQuery.mockReturnValue({
      data: { items: mockCompanies, total: 2, offset: 0, limit: 50 },
      isLoading: false,
    });
  });

  it('renders loading state initially', () => {
    mockUseListCompaniesQuery.mockReturnValue({ isLoading: true });
    renderWithProviders(<CompanyListPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders table with companies after loading', () => {
    renderWithProviders(<CompanyListPage />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Beta Inc')).toBeInTheDocument();
  });

  it('shows address as city, state', () => {
    renderWithProviders(<CompanyListPage />);
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  it('renders empty state when no companies', () => {
    mockUseListCompaniesQuery.mockReturnValue({
      data: { items: [], total: 0, offset: 0, limit: 50 },
      isLoading: false,
    });
    renderWithProviders(<CompanyListPage />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No companies found.')).toBeInTheDocument();
  });

  it('renders error state on API failure', () => {
    mockUseListCompaniesQuery.mockReturnValue({
      isLoading: false,
      error: { status: 500 },
    });
    renderWithProviders(<CompanyListPage />);
    expect(screen.getByText('Failed to load companies.')).toBeInTheDocument();
  });

  it('shows New Company button', () => {
    renderWithProviders(<CompanyListPage />);
    expect(screen.getByTestId('add-company-btn')).toBeInTheDocument();
  });

  it('allows selecting a company via checkbox', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CompanyListPage />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);
    expect(screen.getByTestId('bulk-delete-btn')).toBeInTheDocument();
  });

  it('select all checkbox toggles all rows', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CompanyListPage />);

    const selectAll = screen.getByTestId('select-all-checkbox');
    await user.click(selectAll);

    expect(screen.getByText('Delete Selected (2)')).toBeInTheDocument();
  });

  it('displays pagination info', () => {
    renderWithProviders(<CompanyListPage />);
    expect(screen.getByText('Showing 2 of 2 companies')).toBeInTheDocument();
  });

  it('shows pagination buttons when total exceeds page size', () => {
    mockUseListCompaniesQuery.mockReturnValue({
      data: { items: mockCompanies, total: 100, offset: 0, limit: 50 },
      isLoading: false,
    });
    renderWithProviders(<CompanyListPage />);

    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).toBeEnabled();
  });

  it('has edit and delete buttons per row', () => {
    renderWithProviders(<CompanyListPage />);

    expect(screen.getByTestId('edit-btn-c1')).toBeInTheDocument();
    expect(screen.getByTestId('delete-btn-c1')).toBeInTheDocument();
    expect(screen.getByTestId('edit-btn-c2')).toBeInTheDocument();
    expect(screen.getByTestId('delete-btn-c2')).toBeInTheDocument();
  });
});
