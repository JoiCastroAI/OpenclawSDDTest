import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const CompanyListPage = lazy(
  () => import('../features/companies/components/CompanyListPage'),
);
const NotFound = lazy(() => import('../components/NotFound'));

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <CompanyListPage /> },
      { path: 'companies', element: <CompanyListPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

const AppRouter = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
