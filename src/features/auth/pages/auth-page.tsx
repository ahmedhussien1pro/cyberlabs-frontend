// src/features/auth/pages/auth-page.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Preloader } from '@/components/common/preloader';
import {
  PasswordInput,
  SocialAuthButtons,
  AuthDivider,
} from '@/features/auth/components';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';

import '../styles/auth.css';

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login Form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched', // ✅ Validate only after field is touched
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register Form
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched', // ✅ Validate only after field is touched
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const togglePanel = () => {
    setIsActive(!isActive);
    loginForm.reset();
    registerForm.reset();
  };

  const handleLogin = async (data: LoginForm) => {
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
      toast.error('Login Failed', {
        description: error.message || 'Invalid email or password',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
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
        description: `Welcome ${data.username}!`,
      });

      setTimeout(() => {
        navigate(
          `${ROUTES.AUTH.OTP_VERIFICATION}?email=${encodeURIComponent(data.email)}`,
        );
      }, 1000);
    } catch (error: any) {
      let errorMessage = 'Please try again';
      let errorTitle = 'Registration Failed';

      if (error.message) {
        const message = error.message.toLowerCase();

        if (
          message.includes('username') &&
          (message.includes('exists') ||
            message.includes('taken') ||
            message.includes('already') ||
            message.includes('use'))
        ) {
          errorTitle = 'Username Already Taken';
          errorMessage =
            'This username is already in use. Please choose another one.';
        } else if (
          message.includes('email') &&
          (message.includes('exists') ||
            message.includes('registered') ||
            message.includes('already'))
        ) {
          errorTitle = 'Email Already Registered';
          errorMessage =
            'This email is already registered. Please login instead.';
        } else if (
          error.statusCode === 500 ||
          message.includes('internal server error')
        ) {
          errorTitle = 'Server Error';
          errorMessage =
            'Something went wrong on our end. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorTitle, {
        description: errorMessage,
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

              {/* Auth Divider Component */}
              <AuthDivider text='or login with' />

              {/* Social Auth Buttons Component */}
              <SocialAuthButtons mode='login' disabled={loading} />

              {/* Register Link - Mobile */}
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
                    placeholder='Password (min 6 characters)'
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
                {registerForm.formState.errors.confirmPassword && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1 font-medium'>
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                className='auth-form__submit-btn'
                disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>

              {/* Auth Divider Component */}
              <AuthDivider text='or register with' />

              {/* Social Auth Buttons Component */}
              <SocialAuthButtons mode='register' disabled={loading} />

              {/* Login Link - Mobile */}
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
