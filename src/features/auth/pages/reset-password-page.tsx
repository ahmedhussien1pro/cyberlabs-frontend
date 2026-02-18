// src/features/auth/pages/reset-password-page.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Preloader } from '@/components/common/preloader';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';

// Import reusable components, schemas, and hooks
import {
  PasswordInput,
  PasswordStrengthIndicator,
} from '@/features/auth/components';
import {
  resetPasswordSchema,
  type ResetPasswordForm,
} from '@/features/auth/schemas';
import { calculatePasswordStrength } from '@/features/auth/utils/validation.util';

import '../styles/auth.css';
import { LanguageSwitcher } from '@/components/common/language-switcher';

export default function ResetPasswordPage() {
  const { t } = useTranslation('resetPassword');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = form.watch('password');
  const strength = calculatePasswordStrength(password);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast.error(t('toast.invalidLink'), {
        description: t('toast.invalidLinkDescription'),
      });
    }
  }, [token]);

  const handleSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error(t('toast.invalidToken'));
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, data.password);

      setResetSuccess(true);

      toast.success(t('toast.resetSuccess'), {
        description: t('toast.resetSuccessDescription'),
      });

      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN);
      }, 3000);
    } catch (error: any) {
      toast.error(t('toast.resetFailed'), {
        description: error.message || t('toast.resetFailedDescription'),
      });
    } finally {
      setLoading(false);
    }
  };

  // Invalid Token State
  if (!tokenValid) {
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
              <div className='auth-page__error'>
                <div className='auth-page__error-icon-wrapper'>
                  <XCircle className='auth-page__error-icon' size={64} />
                </div>
                <h2 className='auth-page__error-title'>
                  {t('invalidToken.title')}
                </h2>
                <p className='auth-page__error-text'>
                  {t('invalidToken.description')}
                </p>
                <p className='auth-page__error-subtext'>
                  {t('invalidToken.instruction')}
                </p>

                <Button
                  onClick={() => navigate(ROUTES.AUTH.FORGOT_PASSWORD)}
                  className='auth-page__submit'>
                  {t('invalidToken.requestButton')}
                </Button>

                <div className='auth-page__back'>
                  <Link to={ROUTES.AUTH.LOGIN}>{t('backToLogin')}</Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      {loading && <Preloader />}

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
            {!resetSuccess ? (
              <>
                {/* Header */}
                <div className='auth-page__header'>
                  <div className='auth-page__icon-wrapper'>
                    <Lock className='auth-page__icon' size={48} />
                  </div>
                  <h1 className='auth-page__title'>{t('title')}</h1>
                  <p className='auth-page__subtitle'>{t('subtitle')}</p>
                </div>

                {/* Form */}
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='auth-page__form'>
                  {/* Password Input with Error */}
                  <div className='auth-page__field'>
                    <PasswordInput
                      placeholder={t('passwordPlaceholder')}
                      {...form.register('password')}
                      disabled={loading}
                      error={form.formState.errors.password?.message}
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <PasswordStrengthIndicator password={password} />
                  )}

                  {/* Confirm Password Input with Error */}
                  <div className='auth-page__field'>
                    <PasswordInput
                      placeholder={t('confirmPasswordPlaceholder')}
                      {...form.register('confirmPassword')}
                      disabled={loading}
                      error={form.formState.errors.confirmPassword?.message}
                    />
                  </div>

                  <Button
                    type='submit'
                    className='auth-page__submit'
                    disabled={loading || !strength.isValid}>
                    {loading ? t('resettingButton') : t('resetButton')}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className='auth-page__back'>
                  <Link to={ROUTES.AUTH.LOGIN}>{t('backToLogin')}</Link>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <motion.div
                  className='auth-page__success'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}>
                  <div className='auth-page__success-icon-wrapper'>
                    <CheckCircle
                      className='auth-page__success-icon'
                      size={64}
                    />
                  </div>
                  <h2 className='auth-page__success-title'>
                    {t('success.title')}
                  </h2>
                  <p className='auth-page__success-text'>
                    {t('success.description')}
                  </p>
                  <p className='auth-page__success-subtext'>
                    {t('success.redirectMessage')}
                  </p>

                  <Button
                    onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                    className='auth-page__submit'>
                    {t('success.continueButton')}
                  </Button>
                </motion.div>
              </>
            )}
          </Card>
        </motion.div>
      </section>
    </>
  );
}
