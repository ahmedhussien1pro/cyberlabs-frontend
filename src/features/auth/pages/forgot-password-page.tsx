import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ThemeToggle from '@/shared/components/common/theme-toggle';
import { Preloader } from '@/shared/components/common/preloader';
import { BackToLogin } from '@/features/auth/components';
import { authService } from '@/features/auth/services/auth.service';

import {
  forgotPasswordSchema,
  type ForgotPasswordForm,
} from '@/features/auth/schemas';

import '../styles/auth.css';
import { LanguageSwitcher } from '@/shared/components/common/language-switcher';

export default function ForgotPasswordPage() {
  const { t } = useTranslation('forgotPassword');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);

      setEmailSent(true);

      toast.success(t('toast.emailSent'), {
        description: t('toast.emailSentDescription'),
      });
    } catch (error: any) {
      toast.error(t('toast.requestFailed'), {
        description: error.message || t('toast.tryAgain'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast.error(t('toast.enterEmail'));
      return;
    }

    setResendLoading(true);
    try {
      await authService.forgotPassword(email);

      toast.success(t('toast.emailResent'), {
        description: t('toast.emailResentDescription'),
      });
    } catch (error: any) {
      toast.error(t('toast.resendFailed'), {
        description: error.message || t('toast.tryAgain'),
      });
    } finally {
      setResendLoading(false);
    }
  };

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
            {!emailSent ? (
              <>
                {/* Header */}
                <div className='auth-page__header'>
                  <div className='auth-page__icon-wrapper'>
                    <Mail className='auth-page__icon' size={48} />
                  </div>
                  <h1 className='auth-page__title'>{t('title')}</h1>
                  <p className='auth-page__subtitle'>{t('subtitle')}</p>
                </div>

                {/* Form */}
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='auth-page__form'>
                  <div className='auth-page__input-group'>
                    <Input
                      type='email'
                      placeholder={t('emailPlaceholder')}
                      className='auth-page__input'
                      {...form.register('email')}
                      disabled={loading}
                    />
                    <Mail className='auth-page__input-icon' size={20} />
                  </div>
                  {form.formState.errors.email && (
                    <p className='auth-page__error'>
                      {form.formState.errors.email.message}
                    </p>
                  )}

                  <Button
                    type='submit'
                    className='auth-page__submit'
                    disabled={loading}>
                    {loading ? t('sendingButton') : t('submitButton')}
                  </Button>
                </form>

                <BackToLogin />
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
                  <p className='auth-page__success-email'>
                    {form.getValues('email')}
                  </p>

                  <Button
                    onClick={() =>
                      window.open('https://mail.google.com', '_blank')
                    }
                    className='auth-page__submit'>
                    {t('success.openEmailButton')}
                  </Button>

                  <div className='auth-page__resend'>
                    <p>{t('success.didntReceive')}</p>
                    <button
                      type='button'
                      onClick={handleResendEmail}
                      disabled={resendLoading}>
                      {resendLoading
                        ? t('sendingButton')
                        : t('success.resendButton')}
                    </button>
                  </div>

                  {/* Back to Login Component */}
                  <BackToLogin />
                </motion.div>
              </>
            )}
          </Card>
        </motion.div>
      </section>
    </>
  );
}
