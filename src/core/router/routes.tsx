import { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import * as Pages from './lazy-routes';
import { ROUTES } from '@/shared/constants';
import { LoadingSpinner } from '@/components/common/loading-spinner';

const LazyPage = ({
  Component,
}: {
  Component: React.LazyExoticComponent<() => JSX.Element>;
}) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: <LazyPage Component={Pages.HomePage} />,
  },
  {
    // about page
    path: ROUTES.ABOUT,
    element: <LazyPage Component={Pages.AboutPage} />,
  },
  {
    // contact page
    path: ROUTES.CONTACT,
    element: <LazyPage Component={Pages.ContactPage} />,
  },
  {
    // pricing page
    path: ROUTES.PRICING,
    element: <LazyPage Component={Pages.PricingPage} />,
  },
  {
    // Test login WITHOUT ProtectedRoute
    path: ROUTES.AUTH.LOGIN,
    element: <LazyPage Component={Pages.LoginPage} />,
  },
  {
    path: '*',
    element: <LazyPage Component={Pages.NotFoundPage} />,
  },
  {
    path: ROUTES.UNAUTHORIZED,
    element: <LazyPage Component={Pages.UnauthorizedPage} />,
  },
];

export default routes;
