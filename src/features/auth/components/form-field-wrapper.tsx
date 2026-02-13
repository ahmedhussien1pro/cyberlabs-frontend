// src/features/auth/components/form-field-wrapper.tsx
import { ReactNode } from 'react';

interface FormFieldWrapperProps {
  children: ReactNode;
  error?: string;
  label?: string;
  required?: boolean;
}

/**
 * Wrapper for form fields with consistent error handling
 */
export function FormFieldWrapper({
  children,
  error,
  label,
  required = false,
}: FormFieldWrapperProps) {
  return (
    <div className='space-y-2'>
      {label && (
        <label className='text-sm font-medium text-foreground'>
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </label>
      )}
      {children}
      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
}
