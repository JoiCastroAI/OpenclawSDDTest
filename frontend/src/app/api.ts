import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_URL ?? 'http://localhost:8000') + '/api/v1',
    prepareHeaders: (headers) => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) headers.set('Authorization', `Bearer ${token}`);
      } catch {
        // localStorage unavailable (e.g. in test environments)
      }
      return headers;
    },
  }),
  tagTypes: ['Candidate', 'Position', 'Company'],
  endpoints: () => ({}),
});
