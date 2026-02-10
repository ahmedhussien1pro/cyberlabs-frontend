import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PageLoader } from './PageLoader';

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute = ({
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
};
