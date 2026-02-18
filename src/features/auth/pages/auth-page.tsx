// src/features/auth/pages/auth-page.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ThemeToggle } from '@/shared/components/common/theme-toggle';
import { Preloader } from '@/shared/components/common/preloader';
import {
  PasswordInput,
  PasswordStrengthIndicator,
  SocialAuthButtons,
  AuthDivider,
} from '@/features/auth/components';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';
import { parseAuthError } from '@/features/auth/utils/error-handler';
import {
  loginSchema,
  registerSchema,
  type LoginForm,
  type RegisterForm,
} from '@/features/auth/schemas';

import '../styles/auth.css';
import LanguageSwitcher from '@/shared/components/common/language-switcher';

export default function AuthPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginForm = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterForm>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = registerForm.watch('password');
  const confirmPassword = registerForm.watch('confirmPassword');
  const acceptTerms = registerForm.watch('acceptTerms');

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  const showPasswordMismatch =
    confirmPassword &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  const togglePanel = () => {
    setIsActive(!isActive);
    loginForm.reset();
    registerForm.reset();
    setErrors({});
  };

  const handleLogin = async (data: LoginForm) => {
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await authService.login(data.email, data.password);

      if (!response || !response.user) {
        throw new Error('Invalid response from server');
      }

      const token = response.accessToken || (response as any).token;
      if (!token) {
        throw new Error('Authentication token not received');
      }

      login(response.user, token);
      toast.success(t('messages.loginSuccess'), {
        description: t('messages.loginWelcome', { name: response.user.name }),
      });

      setTimeout(() => navigate(ROUTES.HOME), 1000);
    } catch (error: any) {
      const parsedError = parseAuthError(error);
      toast.error(parsedError.title, {
        description: parsedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setErrors({ confirmPassword: t('validation.passwordsDontMatch') });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await authService.register(
        data.username,
        data.email,
        data.password,
      );

      if (!response || !response.user) {
        throw new Error('Invalid response from server');
      }

      const token = response.accessToken || (response as any).token;
      if (!token) {
        throw new Error('Authentication token not received');
      }

      login(response.user, token);
      toast.success(t('messages.registerSuccess'), {
        description: t('messages.registerWelcome', { username: data.username }),
      });

      setTimeout(() => {
        navigate(
          `${ROUTES.AUTH.OTP_VERIFICATION}?email=${encodeURIComponent(data.email)}`,
        );
      }, 1000);
    } catch (error: any) {
      const parsedError = parseAuthError(error);
      toast.error(parsedError.title, {
        description: parsedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Preloader />}

      <div className='fixed top-4 right-4 z-50'>
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <section className='auth-form'>
        <motion.div
          className={`auth-form__container ${
            isActive ? 'auth-form__container--active' : ''
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}>
          {/* LOGIN FORM */}
          <div className='auth-form__form-box auth-form__form-box--login'>
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className='auth-form__form'>
              <h1 className='auth-form__heading'>{t('login.title')}</h1>

              {/* Email Field */}
              <div>
                <div className='auth-form__input-box'>
                  <Input
                    type='email'
                    placeholder={t('login.emailPlaceholder')}
                    className='auth-form__input'
                    {...loginForm.register('email')}
                    disabled={loading}
                  />
                  <Mail className='auth-form__input-icon' size={18} />
                </div>
                {errors.email && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className='auth-form__input-box'>
                  <PasswordInput
                    placeholder={t('login.passwordPlaceholder')}
                    className='auth-form__input'
                    {...loginForm.register('password')}
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className='auth-form__forgot-link'>
                <Link to={ROUTES.AUTH.FORGOT_PASSWORD}>
                  {t('login.forgotPassword')}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                className='auth-form__submit-btn'
                disabled={loading}>
                {loading
                  ? t('login.submittingButton')
                  : t('login.submitButton')}
              </Button>

              <AuthDivider text={t('login.orContinueWith')} />
              <SocialAuthButtons mode='login' disabled={loading} />

              <div className='auth-form__switch-link md:hidden'>
                {t('login.noAccount')}{' '}
                <button
                  type='button'
                  onClick={togglePanel}
                  className='auth-form__switch-btn'>
                  {t('login.signUpLink')}
                </button>
              </div>
            </form>
          </div>

          {/* REGISTER FORM */}
          <div className='auth-form__form-box auth-form__form-box--register'>
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className='auth-form__form'>
              <h1 className='auth-form__heading'>{t('register.title')}</h1>

              {/* Username Field */}
              <div>
                <div className='auth-form__input-box'>
                  <Input
                    type='text'
                    placeholder={t('register.usernamePlaceholder')}
                    className='auth-form__input'
                    {...registerForm.register('username')}
                    disabled={loading}
                  />
                  <User className='auth-form__input-icon' size={18} />
                </div>
                {errors.username && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <div className='auth-form__input-box'>
                  <Input
                    type='email'
                    placeholder={t('register.emailPlaceholder')}
                    className='auth-form__input'
                    {...registerForm.register('email')}
                    disabled={loading}
                  />
                  <Mail className='auth-form__input-icon' size={18} />
                </div>
                {errors.email && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className='auth-form__input-box'>
                  <PasswordInput
                    placeholder={t('register.passwordPlaceholder')}
                    className='auth-form__input'
                    {...registerForm.register('password')}
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {errors.password}
                  </p>
                )}

                {/* ✅ Password Strength Indicator */}
                {password && !errors.password && (
                  <PasswordStrengthIndicator
                    password={password}
                    className='mt-2'
                  />
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className='auth-form__input-box'>
                  <PasswordInput
                    placeholder={t('register.confirmPasswordPlaceholder')}
                    className='auth-form__input'
                    {...registerForm.register('confirmPassword')}
                    disabled={loading}
                  />
                </div>

                {/* ✅ Real-time password match indicator */}
                {showPasswordMismatch && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {t('validation.passwordsDontMatch')}
                  </p>
                )}
                {passwordsMatch && confirmPassword.length > 0 && (
                  <p className='text-xs text-green-600 dark:text-green-400 mt-1 font-medium flex items-center gap-1'>
                    <span>✓</span> {t('validation.passwordsMatch')}
                  </p>
                )}
                {errors.confirmPassword && !showPasswordMismatch && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* ✅ Terms & Conditions Checkbox */}
              <div className='flex items-start gap-2 my-3'>
                <Checkbox
                  id='acceptTerms'
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    registerForm.setValue('acceptTerms', checked as boolean)
                  }
                  disabled={loading}
                  className='mt-1'
                />
                <label
                  htmlFor='acceptTerms'
                  className='text-xs text-muted-foreground leading-relaxed cursor-pointer'>
                  {t('register.termsPrefix')}{' '}
                  <Link
                    to={ROUTES.TERMS}
                    className='text-primary hover:underline font-medium'
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('register.termsLink')}
                  </Link>{' '}
                  {t('register.termsAnd')}{' '}
                  <Link
                    to={ROUTES.PRIVACY}
                    className='text-primary hover:underline font-medium'
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('register.privacyLink')}
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className='text-xs text-red-600 dark:text-red-400 -mt-2 mb-2 font-medium'>
                  {errors.acceptTerms}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type='submit'
                className='auth-form__submit-btn'
                disabled={
                  loading ||
                  (confirmPassword && !passwordsMatch) ||
                  !acceptTerms
                }>
                {loading
                  ? t('register.submittingButton')
                  : t('register.submitButton')}
              </Button>

              <AuthDivider text={t('register.orContinueWith')} />
              <SocialAuthButtons mode='register' disabled={loading} />

              <div className='auth-form__switch-link md:hidden'>
                {t('register.haveAccount')}{' '}
                <button
                  type='button'
                  onClick={togglePanel}
                  className='auth-form__switch-btn'>
                  {t('register.signInLink')}
                </button>
              </div>
            </form>
          </div>

          {/* Toggle Panels - Desktop Only */}
          <div className='auth-form__toggle-box hidden md:block'>
            <motion.div
              className='auth-form__toggle-panel auth-form__toggle-panel--left'
              initial={{ x: 0 }}
              animate={{ x: isActive ? '-100%' : 0 }}
              transition={{ duration: 0.6 }}>
              <h1 className='auth-form__toggle-heading'>
                {t('toggle.welcomeNew')}
              </h1>
              <p className='auth-form__toggle-text'>{t('toggle.noAccount')}</p>
              <Button
                onClick={togglePanel}
                variant='outline'
                className='auth-form__toggle-btn'
                type='button'>
                {t('register.title')}
              </Button>
            </motion.div>

            <motion.div
              className='auth-form__toggle-panel auth-form__toggle-panel--right'
              initial={{ x: '100%' }}
              animate={{ x: isActive ? 0 : '100%' }}
              transition={{ duration: 0.6 }}>
              <h1 className='auth-form__toggle-heading'>
                {t('toggle.welcomeBack')}
              </h1>
              <p className='auth-form__toggle-text'>
                {t('toggle.haveAccount')}
              </p>
              <Button
                onClick={togglePanel}
                variant='outline'
                className='auth-form__toggle-btn'
                type='button'>
                {t('login.title')}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
