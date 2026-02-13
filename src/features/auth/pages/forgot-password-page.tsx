import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Preloader } from '@/components/common/preloader';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';

// Import schema
import { forgotPasswordSchema, ForgotPasswordForm } from '@/features/auth/schemas';

// Import shared styles
import '../styles/auth-shared.css';
import '../styles/forgot-password-page.css';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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

      toast.success('Email Sent!', {
        description: 'Check your inbox for password reset instructions',
      });
    } catch (error: any) {
      toast.error('Request Failed', {
        description: error.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    await handleSubmit({ email });
  };

  return (
    <>
      {loading && <Preloader />}

      <div className='fixed top-6 right-6 z-50'>
        <ThemeToggle />
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
                  <h1 className='auth-page__title'>Forgot Password?</h1>
                  <p className='auth-page__subtitle'>
                    No worries, we'll send you reset instructions.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='auth-page__form'>
                  <div className='auth-page__input-group'>
                    <Input
                      type='email'
                      placeholder='Enter your email'
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
                    {loading ? 'Sending...' : 'Reset Password'}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className='auth-page__back'>
                  <ArrowLeft size={16} />
                  <Link to={ROUTES.AUTH.LOGIN}>Back to Login</Link>
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
                  <h2 className='auth-page__success-title'>Check your email</h2>
                  <p className='auth-page__success-text'>
                    We sent a password reset link to
                  </p>
                  <p className='auth-page__success-email'>
                    {form.getValues('email')}
                  </p>

                  <Button
                    onClick={() =>
                      window.open('https://mail.google.com', '_blank')
                    }
                    className='auth-page__submit'>
                    Open Email App
                  </Button>

                  <div className='auth-page__resend'>
                    <p>Didn't receive the email?</p>
                    <button
                      type='button'
                      onClick={handleResendEmail}
                      disabled={loading}>
                      Click to resend
                    </button>
                  </div>

                  <div className='auth-page__back'>
                    <ArrowLeft size={16} />
                    <Link to={ROUTES.AUTH.LOGIN}>Back to Login</Link>
                  </div>
                </motion.div>
              </>
            )}
          </Card>
        </motion.div>
      </section>
    </>
  );
}
