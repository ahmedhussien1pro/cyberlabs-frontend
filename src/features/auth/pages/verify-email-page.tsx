// src/pages/auth/verify-email.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/shared/components/common/theme-toggle';
import { LanguageSwitcher } from '@/shared/components/common/language-switcher';
import { Preloader } from '@/shared/components/common/preloader';
import { BackToLogin, ResendButton } from '@/features/auth/components';
import { useResendTimer } from '@/features/auth/hooks';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/constants';
import '../styles/auth.css';

type VerificationStatus = 'verifying' | 'success' | 'error' | 'expired';

export default function VerifyEmailPage() {
  const { t } = useTranslation('verifyEmail');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useAuthStore();

  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const { timeLeft, canResend, startTimer } = useResendTimer(60);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('success');
    }
  }, [token]);

  useEffect(() => {
    if (status === 'success' && token && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && status === 'success' && token) {
      navigate(ROUTES.HOME);
    }
  }, [countdown, status, token, navigate]);

  const verifyEmail = async (verificationToken: string) => {
    setStatus('verifying');
    try {
      await authService.verifyEmailWithToken(verificationToken);
      setStatus('success');
      toast.success(t('toast.verified'), {
        description: t('toast.verifiedDescription'),
      });
    } catch (error: any) {
      if (error.message?.includes('expired')) {
        setStatus('expired');
      } else {
        setStatus('error');
      }
      toast.error(t('toast.failed'), {
        description: error.message || t('toast.failedDescription'),
      });
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    setLoading(true);

    try {
      const email = user?.email || '';
      if (!email) {
        toast.error(t('toast.emailNotFound'), {
          description: t('toast.loginAgain'),
        });
        return;
      }

      await authService.resendVerificationEmail(email);

      toast.success(t('toast.emailSent'), {
        description: t('toast.emailSentDescription'),
      });

      startTimer(60);
    } catch (error: any) {
      toast.error(t('toast.sendFailed'), {
        description: error.message || t('toast.tryAgain'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkipForNow = () => {
    navigate(ROUTES.HOME);
  };

  if (status === 'verifying') {
    return (
      <>
        <div className='fixed top-6 right-6 z-50 flex items-center gap-2'>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <section className='auth-page'>
          <motion.div
            className='auth-page__container'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <Card className='auth-page__card'>
              <div className='auth-page__header'>
                <div className='auth-page__icon-wrapper'>
                  <Loader2 className='auth-page__icon animate-spin' size={48} />
                </div>
                <h1 className='auth-page__title'>{t('verifying.title')}</h1>
                <p className='auth-page__subtitle'>
                  {t('verifying.description')}
                </p>
              </div>
            </Card>
          </motion.div>
        </section>
      </>
    );
  }

  if (status === 'success' && token) {
    return (
      <>
        <div className='fixed top-6 right-6 z-50 flex items-center gap-2'>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <section className='auth-page'>
          <motion.div
            className='auth-page__container'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}>
            <Card className='auth-page__card'>
              <div className='auth-page__header'>
                <motion.div
                  className='auth-page__icon-wrapper'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}>
                  <CheckCircle
                    className='auth-page__icon text-green-500'
                    size={48}
                  />
                </motion.div>
                <h1 className='auth-page__title'>
                  {t('successWithToken.title')}
                </h1>
                <p className='auth-page__subtitle'>
                  {t('successWithToken.description')}
                </p>
                <p className='text-sm text-muted-foreground mt-2'>
                  {t('successWithToken.countdown', { seconds: countdown })}
                </p>
              </div>

              <div className='auth-page__form'>
                <Button
                  onClick={() => navigate(ROUTES.HOME)}
                  className='auth-page__submit'>
                  {t('successWithToken.continueButton')}
                </Button>
              </div>
            </Card>
          </motion.div>
        </section>
      </>
    );
  }

  if (status === 'success' && !token) {
    return (
      <>
        {loading && <Preloader />}

        <div className='fixed top-6 right-6 z-50 flex items-center gap-2'>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <section className='auth-page'>
          <motion.div
            className='auth-page__container'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <Card className='auth-page__card'>
              <div className='auth-page__header'>
                <div className='auth-page__icon-wrapper'>
                  <Mail className='auth-page__icon' size={48} />
                </div>
                <h1 className='auth-page__title'>{t('checkEmail.title')}</h1>
                <p className='auth-page__subtitle'>
                  {t('checkEmail.description')}
                </p>
                <p className='text-sm font-medium text-foreground mt-2'>
                  {user?.email || t('checkEmail.yourEmail')}
                </p>
                <p className='text-sm text-muted-foreground mt-2'>
                  {t('checkEmail.instruction')}
                </p>
              </div>

              <div className='auth-page__form'>
                <Button
                  onClick={() =>
                    window.open('https://mail.google.com', '_blank')
                  }
                  className='auth-page__submit'>
                  {t('checkEmail.openEmailButton')}
                </Button>

                {/* Resend Button Component */}
                <ResendButton
                  canResend={canResend}
                  countdown={timeLeft}
                  onResend={handleResendEmail}
                  loading={loading}
                />

                <Button
                  variant='ghost'
                  onClick={handleSkipForNow}
                  className='w-full'>
                  {t('checkEmail.skipButton')}
                </Button>

                <BackToLogin />
              </div>
            </Card>
          </motion.div>
        </section>
      </>
    );
  }

  if (status === 'expired') {
    return (
      <>
        {loading && <Preloader />}

        <div className='fixed top-6 right-6 z-50 flex items-center gap-2'>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <section className='auth-page'>
          <motion.div
            className='auth-page__container'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <Card className='auth-page__card'>
              <div className='auth-page__header'>
                <div className='auth-page__icon-wrapper'>
                  <XCircle
                    className='auth-page__icon text-orange-500'
                    size={48}
                  />
                </div>
                <h1 className='auth-page__title'>{t('expired.title')}</h1>
                <p className='auth-page__subtitle'>
                  {t('expired.description')}
                </p>
                <p className='text-sm text-muted-foreground mt-2'>
                  {t('expired.instruction')}
                </p>
              </div>

              <div className='auth-page__form'>
                <Button
                  onClick={handleResendEmail}
                  disabled={!canResend || loading}
                  className='auth-page__submit'>
                  {!canResend
                    ? t('expired.resendCountdown', { seconds: timeLeft })
                    : loading
                      ? t('expired.sendingButton')
                      : t('expired.requestButton')}
                </Button>

                <BackToLogin />
              </div>
            </Card>
          </motion.div>
        </section>
      </>
    );
  }

  // Error State
  return (
    <>
      <div className='fixed top-6 right-6 z-50 flex items-center gap-2'>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <section className='auth-page'>
        <motion.div
          className='auth-page__container'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <Card className='auth-page__card'>
            <div className='auth-page__header'>
              <div className='auth-page__icon-wrapper'>
                <XCircle
                  className='auth-page__icon text-destructive'
                  size={48}
                />
              </div>
              <h1 className='auth-page__title'>{t('error.title')}</h1>
              <p className='auth-page__subtitle'>{t('error.description')}</p>
              <p className='text-sm text-muted-foreground mt-2'>
                {t('error.instruction')}
              </p>
            </div>

            <div className='auth-page__form'>
              <Button
                onClick={handleResendEmail}
                disabled={!canResend || loading}
                className='auth-page__submit'>
                {loading ? t('error.sendingButton') : t('error.requestButton')}
              </Button>

              <BackToLogin />
            </div>
          </Card>
        </motion.div>
      </section>
    </>
  );
}
