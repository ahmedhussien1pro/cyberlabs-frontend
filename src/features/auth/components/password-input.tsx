// src/features/auth/components/password-input.tsx
import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

/**
 * Reusable password input component with toggle visibility
 * Supports both controlled and uncontrolled usage with react-hook-form
 *
 * NOTE: This component only renders the input and toggle button.
 * Error messages should be displayed by the parent component.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <>
        <Input
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={className || ''}
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors'
          aria-label={showPassword ? 'Hide password' : 'Show password'}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
