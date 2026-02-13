import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

import './forgot-password-page.css';
import '../../../core/styles/globals.css';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
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

      <section className='forgot-password-page'>
        <motion.div
          className='forgot-password-page__container'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <Card className='forgot-password-page__card'>
            {!emailSent ? (
              <>
                {/* Header */}
                <div className='forgot-password-page__header'>
                  <div className='forgot-password-page__icon-wrapper'>
                    <Mail className='forgot-password-page__icon' size={48} />
                  </div>
                  <h1 className='forgot-password-page__title'>
                    Forgot Password?
                  </h1>
                  <p className='forgot-password-page__subtitle'>
                    No worries, we'll send you reset instructions.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='forgot-password-page__form'>
                  <div className='forgot-password-page__input-group'>
                    <Input
                      type='email'
                      placeholder='Enter your email'
                      className='forgot-password-page__input'
                      {...form.register('email')}
                      disabled={loading}
                    />
                    <Mail
                      className='forgot-password-page__input-icon'
                      size={20}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className='forgot-password-page__error'>
                      {form.formState.errors.email.message}
                    </p>
                  )}

                  <Button
                    type='submit'
                    className='forgot-password-page__submit'
                    disabled={loading}>
                    {loading ? 'Sending...' : 'Reset Password'}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className='forgot-password-page__back'>
                  <ArrowLeft size={16} />
                  <Link to={ROUTES.AUTH.LOGIN}>Back to Login</Link>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <motion.div
                  className='forgot-password-page__success'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}>
                  <div className='forgot-password-page__success-icon-wrapper'>
                    <CheckCircle
                      className='forgot-password-page__success-icon'
                      size={64}
                    />
                  </div>
                  <h2 className='forgot-password-page__success-title'>
                    Check your email
                  </h2>
                  <p className='forgot-password-page__success-text'>
                    We sent a password reset link to
                  </p>
                  <p className='forgot-password-page__success-email'>
                    {form.getValues('email')}
                  </p>

                  <Button
                    onClick={() =>
                      window.open('https://mail.google.com', '_blank')
                    }
                    className='forgot-password-page__submit'>
                    Open Email App
                  </Button>

                  <div className='forgot-password-page__resend'>
                    <p>Didn't receive the email?</p>
                    <button
                      type='button'
                      onClick={handleResendEmail}
                      disabled={loading}>
                      Click to resend
                    </button>
                  </div>

                  <div className='forgot-password-page__back'>
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
