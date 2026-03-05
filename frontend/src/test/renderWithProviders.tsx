import { type FC, type PropsWithChildren } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { baseApi } from '../app/api';
import companiesReducer from '../features/companies/companiesSlice';
import type { RootState } from '../app/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore;
}

function createTestStore(preloadedState?: Partial<RootState>): EnhancedStore {
  return configureStore({
    reducer: {
      companies: companiesReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
    preloadedState: preloadedState as RootState,
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState, store = createTestStore(preloadedState), ...renderOptions }: ExtendedRenderOptions = {},
) {
  // Reset RTK Query cache for test isolation
  store.dispatch(baseApi.util.resetApiState());

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
