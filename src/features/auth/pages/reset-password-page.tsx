import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Preloader } from '@/components/common/preloader';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';

// Import new reusable components and schemas
import { PasswordInput } from '@/features/auth/components/password-input';
import { PasswordStrengthIndicator } from '@/features/auth/components/password-strength';
import { resetPasswordSchema } from '@/features/auth/schemas';
import { usePasswordStrength } from '@/features/auth/hooks/usePasswordStrength';

import '../styles/auth.css';

export default function ResetPasswordPage() {
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
  const strength = usePasswordStrength(password);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast.error('Invalid Reset Link', {
        description: 'The password reset link is invalid or expired',
      });
    }
  }, [token]);

  const handleSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error('Invalid token');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(
        token,
        data.password,
        data.confirmPassword,
      );

      setResetSuccess(true);

      toast.success('Password Reset Successfully!', {
        description: 'You can now login with your new password',
      });

      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN);
      }, 3000);
    } catch (error: any) {
      toast.error('Reset Failed', {
        description:
          error.message || 'Please try again or request a new reset link',
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
                <h2 className='auth-page__error-title'>Invalid Link</h2>
                <p className='auth-page__error-text'>
                  This password reset link is invalid or has expired.
                </p>
                <p className='auth-page__error-subtext'>
                  Please request a new password reset link.
                </p>

                <Button
                  onClick={() => navigate(ROUTES.AUTH.FORGOT_PASSWORD)}
                  className='auth-page__submit'>
                  Request New Link
                </Button>

                <div className='auth-page__back'>
                  <Link to={ROUTES.AUTH.LOGIN}>Back to Login</Link>
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
                  <h1 className='auth-page__title'>Set New Password</h1>
                  <p className='auth-page__subtitle'>
                    Your new password must be different from previously used
                    passwords.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='auth-page__form'>
                  {/* Password Input with Strength Indicator */}
                  <PasswordInput
                    placeholder='New Password'
                    {...form.register('password')}
                    disabled={loading}
                    error={form.formState.errors.password?.message}
                  />

                  {/* Password Strength Indicator */}
                  <PasswordStrengthIndicator password={password} />

                  {/* Confirm Password Input */}
                  <PasswordInput
                    placeholder='Confirm New Password'
                    {...form.register('confirmPassword')}
                    disabled={loading}
                    error={form.formState.errors.confirmPassword?.message}
                  />

                  <Button
                    type='submit'
                    className='auth-page__submit'
                    disabled={loading || strength.score < 4}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className='auth-page__back'>
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
                  <h2 className='auth-page__success-title'>
                    Password Reset Successfully!
                  </h2>
                  <p className='auth-page__success-text'>
                    Your password has been successfully reset.
                  </p>
                  <p className='auth-page__success-subtext'>
                    You will be redirected to the login page in a moment...
                  </p>

                  <Button
                    onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                    className='auth-page__submit'>
                    Continue to Login
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
