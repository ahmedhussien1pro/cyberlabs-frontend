import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation('auth');

    return (
      <>
        <Input
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={className || ''}
          placeholder={t('login.passwordPlaceholder')}
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors'
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
