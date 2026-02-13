import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Preloader } from '@/components/common/preloader';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';

import '../styles/reset-password-page.css';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = form.watch('password');

  // Password strength indicators
  const passwordStrength = {
    hasMinLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

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

  if (!tokenValid) {
    return (
      <>
        <div className='fixed top-6 right-6 z-50'>
          <ThemeToggle />
        </div>

        <section className='reset-password-page'>
          <motion.div
            className='reset-password-page__container'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <Card className='reset-password-page__card'>
              <div className='reset-password-page__error-state'>
                <div className='reset-password-page__error-icon-wrapper'>
                  <XCircle
                    className='reset-password-page__error-icon'
                    size={64}
                  />
                </div>
                <h2 className='reset-password-page__error-title'>
                  Invalid Link
                </h2>
                <p className='reset-password-page__error-text'>
                  This password reset link is invalid or has expired.
                </p>
                <p className='reset-password-page__error-subtext'>
                  Please request a new password reset link.
                </p>

                <Button
                  onClick={() => navigate(ROUTES.AUTH.FORGOT_PASSWORD)}
                  className='reset-password-page__submit'>
                  Request New Link
                </Button>

                <div className='reset-password-page__back'>
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

      <section className='reset-password-page'>
        <motion.div
          className='reset-password-page__container'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <Card className='reset-password-page__card'>
            {!resetSuccess ? (
              <>
                {/* Header */}
                <div className='reset-password-page__header'>
                  <div className='reset-password-page__icon-wrapper'>
                    <Lock className='reset-password-page__icon' size={48} />
                  </div>
                  <h1 className='reset-password-page__title'>
                    Set New Password
                  </h1>
                  <p className='reset-password-page__subtitle'>
                    Your new password must be different from previously used
                    passwords.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='reset-password-page__form'>
                  {/* Password Input */}
                  <div className='reset-password-page__input-group'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='New Password'
                      className='reset-password-page__input'
                      {...form.register('password')}
                      disabled={loading}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='reset-password-page__input-icon reset-password-page__input-icon--clickable'>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className='reset-password-page__strength'>
                      <div className='reset-password-page__strength-bar'>
                        <motion.div
                          className={`reset-password-page__strength-fill reset-password-page__strength-fill--${
                            strengthScore <= 1
                              ? 'weak'
                              : strengthScore <= 2
                                ? 'fair'
                                : strengthScore <= 3
                                  ? 'good'
                                  : 'strong'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(strengthScore / 4) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className='reset-password-page__strength-text'>
                        Password strength:{' '}
                        <span
                          className={`reset-password-page__strength-label reset-password-page__strength-label--${
                            strengthScore <= 1
                              ? 'weak'
                              : strengthScore <= 2
                                ? 'fair'
                                : strengthScore <= 3
                                  ? 'good'
                                  : 'strong'
                          }`}>
                          {strengthScore <= 1
                            ? 'Weak'
                            : strengthScore <= 2
                              ? 'Fair'
                              : strengthScore <= 3
                                ? 'Good'
                                : 'Strong'}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Password Requirements */}
                  <div className='reset-password-page__requirements'>
                    <p className='reset-password-page__requirements-title'>
                      Password must contain:
                    </p>
                    <ul className='reset-password-page__requirements-list'>
                      <li
                        className={
                          passwordStrength.hasMinLength
                            ? 'reset-password-page__requirement--valid'
                            : ''
                        }>
                        <CheckCircle size={16} />
                        At least 6 characters
                      </li>
                      <li
                        className={
                          passwordStrength.hasUpperCase
                            ? 'reset-password-page__requirement--valid'
                            : ''
                        }>
                        <CheckCircle size={16} />
                        One uppercase letter
                      </li>
                      <li
                        className={
                          passwordStrength.hasLowerCase
                            ? 'reset-password-page__requirement--valid'
                            : ''
                        }>
                        <CheckCircle size={16} />
                        One lowercase letter
                      </li>
                      <li
                        className={
                          passwordStrength.hasNumber
                            ? 'reset-password-page__requirement--valid'
                            : ''
                        }>
                        <CheckCircle size={16} />
                        One number
                      </li>
                    </ul>
                  </div>

                  {/* Confirm Password Input */}
                  <div className='reset-password-page__input-group'>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Confirm New Password'
                      className='reset-password-page__input'
                      {...form.register('confirmPassword')}
                      disabled={loading}
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='reset-password-page__input-icon reset-password-page__input-icon--clickable'>
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className='reset-password-page__error'>
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}

                  <Button
                    type='submit'
                    className='reset-password-page__submit'
                    disabled={loading || strengthScore < 4}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className='reset-password-page__back'>
                  <Link to={ROUTES.AUTH.LOGIN}>Back to Login</Link>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <motion.div
                  className='reset-password-page__success'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}>
                  <div className='reset-password-page__success-icon-wrapper'>
                    <CheckCircle
                      className='reset-password-page__success-icon'
                      size={64}
                    />
                  </div>
                  <h2 className='reset-password-page__success-title'>
                    Password Reset Successfully!
                  </h2>
                  <p className='reset-password-page__success-text'>
                    Your password has been successfully reset.
                  </p>
                  <p className='reset-password-page__success-subtext'>
                    You will be redirected to the login page in a moment...
                  </p>

                  <Button
                    onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                    className='reset-password-page__submit'>
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
