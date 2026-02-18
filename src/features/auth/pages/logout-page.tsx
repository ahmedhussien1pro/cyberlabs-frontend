import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Preloader } from '@/shared/components/common/preloader';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';

export default function LogoutPage() {
  const { t } = useTranslation('logout');
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        logout();
        toast.success(t('toast.success'), {
          description: t('toast.successDescription'),
        });
        setTimeout(() => {
          navigate(ROUTES.AUTH.LOGIN);
        }, 1000);
      }
    };

    handleLogout();
  }, [logout, navigate]);

  return <Preloader />;
}
