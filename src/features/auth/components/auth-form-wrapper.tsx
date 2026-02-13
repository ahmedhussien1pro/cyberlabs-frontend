// src/features/auth/components/auth-form-wrapper.tsx
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface AuthFormWrapperProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

/**
 * Wrapper for all auth forms
 * Provides consistent spacing and styling
 */
export function AuthFormWrapper({
  children,
  title,
  className = '',
}: AuthFormWrapperProps) {
  return (
    <Card className={`w-full max-w-md p-8 ${className}`}>
      {title && (
        <h1 className='text-2xl font-bold text-center mb-6'>{title}</h1>
      )}
      {children}
    </Card>
  );
}
