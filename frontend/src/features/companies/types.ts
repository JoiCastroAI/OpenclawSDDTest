export interface Company {
  id: string;
  name: string;
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  revenue: number;
  expenses: number;
  profit: number;
  employees: number;
  clients: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyCreate {
  name: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
  revenue?: number;
  expenses?: number;
  employees?: number;
  clients?: number;
}

export interface CompanyUpdate {
  name: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
  revenue?: number;
  expenses?: number;
  employees?: number;
  clients?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}
