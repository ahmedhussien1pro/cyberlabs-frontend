import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/constants';

interface BackToLoginProps {
  className?: string;
  variant?: 'default' | 'auth-page';
}

export function BackToLogin({
  className,
  variant = 'default',
}: BackToLoginProps) {
  const { t } = useTranslation('auth');

  if (variant === 'auth-page') {
    return (
      <div className={`auth-page__back ${className || ''}`}>
        <ArrowLeft size={16} />
        <Link to={ROUTES.AUTH.LOGIN}>{t('common.backToLogin')}</Link>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-primary transition-colors ${className || ''}`}>
      <ArrowLeft size={16} />
      <Link to={ROUTES.AUTH.LOGIN} className='font-medium'>
        {t('common.backToLogin')}
      </Link>
    </div>
  );
}
