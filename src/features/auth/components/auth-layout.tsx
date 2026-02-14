import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { AuthErrorBoundary } from './auth-error-boundary';

interface AuthLayoutProps {
  children: ReactNode;
  showThemeToggle?: boolean;
  className?: string;
}

export function AuthLayout({
  children,
  showThemeToggle = true,
  className = '',
}: AuthLayoutProps) {
  return (
    <AuthErrorBoundary>
      {/* Theme Toggle */}
      {showThemeToggle && (
        <div className='fixed top-6 right-6 z-50'>
          <ThemeToggle />
        </div>
      )}

      {/* Main Content */}
      <section className={`auth-page ${className}`}>{children}</section>
    </AuthErrorBoundary>
  );
}
