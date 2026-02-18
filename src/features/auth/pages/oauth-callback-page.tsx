// src/features/auth/pages/oauth-callback-page.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/shared/components/common/theme-toggle';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/constants';
import '../styles/auth.css';
import { tokenUtils, roleUtils } from '@/features/auth/utils';
import { LanguageSwitcher } from '@/shared/components/common/language-switcher';

type CallbackStatus = 'processing' | 'success' | 'error';

export default function OAuthCallbackPage() {
  const { t } = useTranslation('oauthCallback');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  const [status, setStatus] = useState<CallbackStatus>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const hasProcessed = useRef(false);

  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const error = searchParams.get('error');

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    if (error) {
      setStatus('error');
      setErrorMessage(t('errors.oauthError', { error }));
      toast.error(t('toast.authFailed'), {
        description: t('toast.oauthProviderError', { error }),
      });
      return;
    }

    if (!accessToken) {
      setStatus('error');
      setErrorMessage(t('errors.missingToken'));
      toast.error(t('toast.authFailed'), {
        description: t('toast.noTokenReceived'),
      });
      return;
    }

    const handleOAuthTokens = async (token: string, refresh: string) => {
      try {
        const decoded = tokenUtils.decode(token);
        const emailName = decoded.email.split('@')[0];
        const userName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

        const user = {
          id: decoded.sub,
          email: decoded.email,
          name: userName,
          role: roleUtils.mapBackendRole(decoded.role),
        };

        login(user, {
          accessToken: token,
          refreshToken: refresh ?? '',
        });

        if (refresh) {
          localStorage.setItem(
            `${import.meta.env.VITE_STORAGE_PREFIX ?? 'cyberlabs_'}refreshToken`,
            refresh,
          );
        }

        setStatus('success');

        toast.success(t('toast.welcome'), {
          description: t('toast.loggedInAs', { name: user.name }),
        });

        setTimeout(() => {
          navigate(ROUTES.HOME);
        }, 2000);
      } catch (err: any) {
        if (import.meta.env.DEV) {
          console.warn(
            '[OAuthCallback] token processing failed:',
            err?.message,
          );
        }

        setStatus('error');
        setErrorMessage(err.message || t('errors.processingFailed'));

        toast.error(t('toast.authFailed'), {
          description: err.message || t('toast.unableToComplete'),
        });
      }
    };

    handleOAuthTokens(accessToken, refreshToken ?? '');
  }, [accessToken, refreshToken, error, login, navigate, t]);

  return (
    <>
      <div className='fixed top-6 right-6 z-50'>
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <section className='auth-page'>
        <motion.div
          className='auth-page__container'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <Card className='auth-page__card'>
            {status === 'processing' && (
              <div className='auth-page__verifying'>
                <div className='auth-page__verifying-icon-wrapper'>
                  <Loader2 className='auth-page__verifying-icon' size={64} />
                </div>
                <h2 className='auth-page__verifying-title'>
                  {t('processing.title')}
                </h2>
                <p className='auth-page__verifying-text'>
                  {t('processing.description')}
                </p>
              </div>
            )}

            {status === 'success' && (
              <motion.div
                className='auth-page__success'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}>
                <div className='auth-page__success-icon-wrapper'>
                  <CheckCircle className='auth-page__success-icon' size={64} />
                </div>
                <h2 className='auth-page__success-title'>
                  {t('success.title')}
                </h2>
                <p className='auth-page__success-text'>
                  {t('success.description')}
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                className='auth-page__error'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}>
                <div className='auth-page__error-icon-wrapper'>
                  <XCircle className='auth-page__error-icon' size={64} />
                </div>
                <h2 className='auth-page__error-title'>{t('error.title')}</h2>
                <p className='auth-page__error-text'>
                  {errorMessage || t('error.defaultMessage')}
                </p>

                <Button
                  onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                  className='auth-page__submit'>
                  {t('error.backButton')}
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </section>
    </>
  );
}
