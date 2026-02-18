// src/features/auth/components/password-input.tsx

import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const { t, i18n } = useTranslation('auth');
    const isRTL = i18n.dir() === 'rtl';

    return (
      <>
        <Input
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn(isRTL ? 'pl-3 pr-3' : 'pr-3 pl-3', className)}
          placeholder={placeholder ?? t('login.passwordPlaceholder')}
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className={cn(
            'absolute top-1/2 -translate-y-1/2',
            'text-muted-foreground hover:text-primary transition-colors',
            isRTL ? 'left-3 right-auto' : 'right-3 left-auto',
          )}
          aria-label={
            showPassword ? t('login.hidePassword') : t('login.showPassword')
          }>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
