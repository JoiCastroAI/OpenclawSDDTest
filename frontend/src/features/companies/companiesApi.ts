import { baseApi } from '../../app/api';
import type { Company, CompanyCreate, CompanyUpdate, PaginatedResponse } from './types';

export const companiesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listCompanies: build.query<PaginatedResponse<Company>, { offset?: number; limit?: number }>({
      query: ({ offset = 0, limit = 50 }) => `companies?offset=${offset}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [...result.items.map(({ id }) => ({ type: 'Company' as const, id })), 'Company']
          : ['Company'],
    }),
    getCompany: build.query<Company, string>({
      query: (id) => `companies/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Company', id }],
    }),
    createCompany: build.mutation<Company, CompanyCreate>({
      query: (body) => ({ url: 'companies', method: 'POST', body }),
      invalidatesTags: ['Company'],
    }),
    updateCompany: build.mutation<Company, { id: string; data: CompanyUpdate }>({
      query: ({ id, data }) => ({ url: `companies/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Company', id }],
    }),
    deleteCompany: build.mutation<void, string>({
      query: (id) => ({ url: `companies/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Company'],
    }),
    bulkDeleteCompanies: build.mutation<void, string[]>({
      query: (ids) => ({ url: 'companies', method: 'DELETE', body: { ids } }),
      invalidatesTags: ['Company'],
    }),
  }),
});

export const {
  useListCompaniesQuery,
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useBulkDeleteCompaniesMutation,
} = companiesApi;
