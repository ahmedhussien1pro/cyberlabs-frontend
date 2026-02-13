import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

/**
 * Reusable password input component with toggle visibility
 * Supports both controlled and uncontrolled usage with react-hook-form
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className='space-y-1'>
        <div className='auth-page__input-group'>
          <Input
            {...props}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`auth-page__input ${className || ''}`}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='auth-page__input-icon auth-page__input-icon--clickable'
            aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {error && <p className='auth-page__error'>{error}</p>}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
