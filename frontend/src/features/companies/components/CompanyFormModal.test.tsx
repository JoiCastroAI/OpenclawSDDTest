import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompanyFormModal from './CompanyFormModal';
import { renderWithProviders } from '../../../test/renderWithProviders';

const existingCompany = {
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
};

const mockCreateCompany = vi.fn();
const mockUpdateCompany = vi.fn();
const mockGetCompanyResult = vi.fn();

vi.mock('../companiesApi', () => ({
  useCreateCompanyMutation: () => [
    mockCreateCompany,
    { isLoading: false },
  ],
  useUpdateCompanyMutation: () => [
    mockUpdateCompany,
    { isLoading: false },
  ],
  useGetCompanyQuery: (...args: unknown[]) => mockGetCompanyResult(...(args as [])),
}));

const createModeState = {
  companies: {
    selectedIds: [] as string[],
    isFormModalOpen: true,
    editingCompanyId: null,
    isDeleteConfirmOpen: false,
  },
};

const editModeState = {
  companies: {
    selectedIds: [] as string[],
    isFormModalOpen: true,
    editingCompanyId: 'c1',
    isDeleteConfirmOpen: false,
  },
};

describe('CompanyFormModal — Create Mode', () => {
  beforeEach(() => {
    mockCreateCompany.mockReturnValue({ unwrap: () => Promise.resolve(existingCompany) });
    mockUpdateCompany.mockReturnValue({ unwrap: () => Promise.resolve(existingCompany) });
    mockGetCompanyResult.mockReturnValue({ data: undefined });
  });

  it('renders with "New Company" title', () => {
    renderWithProviders(<CompanyFormModal />, { preloadedState: createModeState });
    expect(screen.getByText('New Company')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    renderWithProviders(<CompanyFormModal />, { preloadedState: createModeState });
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 123 Main Street')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. San Francisco')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. CA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 94102')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. USA')).toBeInTheDocument();
  });

  it('shows Create Company button text', () => {
    renderWithProviders(<CompanyFormModal />, { preloadedState: createModeState });
    expect(screen.getByTestId('submit-btn')).toHaveTextContent('Create Company');
  });

  it('requires name field', () => {
    renderWithProviders(<CompanyFormModal />, { preloadedState: createModeState });
    expect(screen.getByTestId('input-name')).toBeRequired();
  });

  it('submits create form successfully', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CompanyFormModal />, { preloadedState: createModeState });

    await user.type(screen.getByTestId('input-name'), 'New Company Inc');
    await user.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(mockCreateCompany).toHaveBeenCalled();
    });
  });

  it('shows server error on 409 conflict', async () => {
    mockCreateCompany.mockReturnValue({
      unwrap: () => Promise.reject({ status: 409 }),
    });

    const user = userEvent.setup();
    renderWithProviders(<CompanyFormModal />, { preloadedState: createModeState });

    await user.type(screen.getByTestId('input-name'), 'Duplicate Corp');
    await user.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('server-error')).toHaveTextContent(
      'A company with this name already exists.',
    );
  });

  it('shows generic server error on unexpected failure', async () => {
    mockCreateCompany.mockReturnValue({
      unwrap: () => Promise.reject({ status: 500 }),
    });

    const user = userEvent.setup();
    renderWithProviders(<CompanyFormModal />, { preloadedState: createModeState });

    await user.type(screen.getByTestId('input-name'), 'Error Corp');
    await user.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('server-error')).toHaveTextContent(
      'An unexpected error occurred. Please try again.',
    );
  });

  it('displays calculated profit', () => {
    renderWithProviders(<CompanyFormModal />, { preloadedState: createModeState });
    expect(screen.getByText('Calculated profit:')).toBeInTheDocument();
    expect(screen.getByText('$0.00M')).toBeInTheDocument();
  });
});

describe('CompanyFormModal — Edit Mode', () => {
  beforeEach(() => {
    mockCreateCompany.mockReturnValue({ unwrap: () => Promise.resolve(existingCompany) });
    mockUpdateCompany.mockReturnValue({ unwrap: () => Promise.resolve(existingCompany) });
    mockGetCompanyResult.mockReturnValue({ data: existingCompany });
  });

  it('renders with "Edit Company" title', () => {
    renderWithProviders(<CompanyFormModal />, { preloadedState: editModeState });
    expect(screen.getByText('Edit Company')).toBeInTheDocument();
  });

  it('shows Save Changes button text', () => {
    renderWithProviders(<CompanyFormModal />, { preloadedState: editModeState });
    expect(screen.getByTestId('submit-btn')).toHaveTextContent('Save Changes');
  });

  it('populates form with existing company data', async () => {
    renderWithProviders(<CompanyFormModal />, { preloadedState: editModeState });

    await waitFor(() => {
      expect(screen.getByTestId('input-name')).toHaveValue('Acme Corp');
    });
  });
});
