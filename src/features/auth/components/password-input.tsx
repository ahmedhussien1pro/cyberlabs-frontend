// src/features/auth/components/password-input.tsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  name: string;
  error?: string;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  disabled,
  name,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='auth-form__input-wrapper'>
      <div className='auth-form__input-box'>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className='auth-form__input'
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='auth-form__input-icon-btn'
          aria-label={showPassword ? 'Hide password' : 'Show password'}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className='auth-form__error'>{error}</p>}
    </div>
  );
}
