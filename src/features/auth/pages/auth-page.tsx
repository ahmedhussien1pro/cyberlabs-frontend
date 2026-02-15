// src/features/auth/pages/auth-page.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Preloader } from '@/components/common/preloader';
import {
  PasswordInput,
  PasswordStrengthIndicator,
  SocialAuthButtons,
  AuthDivider,
} from '@/features/auth/components';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from '../utils';
import { parseAuthError } from '../utils/error-handler';

import '../styles/auth.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login Form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // ✅ Validate only on blur
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register Form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur', // ✅ Validate only on blur
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Watch password for strength indicator
  const password = registerForm.watch('password');
  const confirmPassword = registerForm.watch('confirmPassword');

  // Custom password match validation
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  const showPasswordMismatch =
    confirmPassword &&
    confirmPassword.length > 0 &&
    password !== confirmPassword &&
    registerForm.formState.touchedFields.confirmPassword;

  const togglePanel = () => {
    setIsActive(!isActive);
    loginForm.reset();
    registerForm.reset();
  };

  const handleLogin = async (data: LoginFormData) => {
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
      toast.success('Welcome Back!', {
        description: `Hi ${response.user.name}!`,
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

  const handleRegister = async (data: RegisterFormData) => {
    // Additional password match validation
    if (data.password !== data.confirmPassword) {
      registerForm.setError('confirmPassword', {
        type: 'manual',
        message: "Passwords don't match",
      });
      return;
    }

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
      toast.success('Registration Successful!', {
        description: `Welcome ${data.username}! Please verify your email.`,
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
              <h1 className='auth-form__heading'>Login</h1>

              {/* Email Field */}
              <div>
                <div className='auth-form__input-box'>
                  <Input
                    type='email'
                    placeholder='Email'
                    className='auth-form__input'
                    {...loginForm.register('email')}
                    disabled={loading}
                  />
                  <Mail className='auth-form__input-icon' size={18} />
                </div>
                {loginForm.formState.errors.email && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className='auth-form__input-box'>
                  <PasswordInput
                    placeholder='Password'
                    className='auth-form__input'
                    {...loginForm.register('password')}
                    disabled={loading}
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className='auth-form__forgot-link'>
                <Link to={ROUTES.AUTH.FORGOT_PASSWORD}>Forgot password?</Link>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                className='auth-form__submit-btn'
                disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <AuthDivider text='or login with' />
              <SocialAuthButtons mode='login' disabled={loading} />

              <div className='auth-form__switch-link md:hidden'>
                Don't have an account?{' '}
                <button
                  type='button'
                  onClick={togglePanel}
                  className='auth-form__switch-btn'>
                  Register
                </button>
              </div>
            </form>
          </div>

          {/* REGISTER FORM */}
          <div className='auth-form__form-box auth-form__form-box--register'>
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className='auth-form__form'>
              <h1 className='auth-form__heading'>Register</h1>

              {/* Username Field */}
              <div>
                <div className='auth-form__input-box'>
                  <Input
                    type='text'
                    placeholder='Username'
                    className='auth-form__input'
                    {...registerForm.register('username')}
                    disabled={loading}
                  />
                  <User className='auth-form__input-icon' size={18} />
                </div>
                {registerForm.formState.errors.username && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {registerForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <div className='auth-form__input-box'>
                  <Input
                    type='email'
                    placeholder='Email'
                    className='auth-form__input'
                    {...registerForm.register('email')}
                    disabled={loading}
                  />
                  <Mail className='auth-form__input-icon' size={18} />
                </div>
                {registerForm.formState.errors.email && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className='auth-form__input-box'>
                  <PasswordInput
                    placeholder='Password'
                    className='auth-form__input'
                    {...registerForm.register('password')}
                    disabled={loading}
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {registerForm.formState.errors.password.message}
                  </p>
                )}

                {/* ✅ Password Strength Indicator */}
                {password && !registerForm.formState.errors.password && (
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
                    placeholder='Confirm Password'
                    className='auth-form__input'
                    {...registerForm.register('confirmPassword')}
                    disabled={loading}
                  />
                </div>

                {/* ✅ Real-time password match indicator */}
                {showPasswordMismatch && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    Passwords don't match
                  </p>
                )}
                {passwordsMatch && confirmPassword.length > 0 && (
                  <p className='text-xs text-green-600 dark:text-green-400 mt-1 font-medium flex items-center gap-1'>
                    <span>✓</span> Passwords match
                  </p>
                )}
                {registerForm.formState.errors.confirmPassword &&
                  !showPasswordMismatch && (
                    <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                className='auth-form__submit-btn'
                disabled={loading || (confirmPassword && !passwordsMatch)}>
                {loading ? 'Registering...' : 'Register'}
              </Button>

              <AuthDivider text='or register with' />
              <SocialAuthButtons mode='register' disabled={loading} />

              <div className='auth-form__switch-link md:hidden'>
                Already have an account?{' '}
                <button
                  type='button'
                  onClick={togglePanel}
                  className='auth-form__switch-btn'>
                  Login
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
              <h1 className='auth-form__toggle-heading'>Hello, Welcome!</h1>
              <p className='auth-form__toggle-text'>Don't have an account?</p>
              <Button
                onClick={togglePanel}
                variant='outline'
                className='auth-form__toggle-btn'
                type='button'>
                Register
              </Button>
            </motion.div>

            <motion.div
              className='auth-form__toggle-panel auth-form__toggle-panel--right'
              initial={{ x: '100%' }}
              animate={{ x: isActive ? 0 : '100%' }}
              transition={{ duration: 0.6 }}>
              <h1 className='auth-form__toggle-heading'>Welcome Back!</h1>
              <p className='auth-form__toggle-text'>Already have an account?</p>
              <Button
                onClick={togglePanel}
                variant='outline'
                className='auth-form__toggle-btn'
                type='button'>
                Login
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
