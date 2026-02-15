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
    confirmPassword: z.string(),
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
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register Form
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
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

      console.log('Login response:', response);

      if (!response || !response.user) {
        console.error('Invalid login response structure:', response);
        throw new Error('Invalid response from server');
      }

      const token = response.accessToken || (response as any).token;

      if (!token) {
        console.error('No token in response:', response);
        throw new Error('Authentication token not received');
      }

      // Store user and token
      login(response.user, token);

      toast.success('Welcome Back!', {
        description: `Hi ${response.user.name}!`,
      });

      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1000);
    } catch (error: any) {
      console.error('Login error:', error);
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

      console.log('Register response:', response);

      if (!response || !response.user) {
        console.error('Invalid register response structure:', response);
        throw new Error('Invalid response from server');
      }

      const token = response.accessToken || (response as any).token;

      if (!token) {
        console.error('No token in response:', response);
        throw new Error('Authentication token not received');
      }

      // Store user and token
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
      console.error('Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data,
      });

      toast.error('Registration Failed', {
        description: error.message || 'Please try again',
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
          {/* Login Form */}
          <div className='auth-form__form-box auth-form__form-box--login'>
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className='auth-form__form'>
              <h1 className='auth-form__heading'>Login</h1>

              {/* Email Field */}
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
                <p className='auth-form__error'>
                  {loginForm.formState.errors.email.message}
                </p>
              )}

              {/* Password Field - Using PasswordInput Component */}
              <div className='auth-form__input-box'>
                <PasswordInput
                  placeholder='Password'
                  {...loginForm.register('password')}
                  disabled={loading}
                  error={loginForm.formState.errors.password?.message}
                />
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

          {/* Register Form */}
          <div className='auth-form__form-box auth-form__form-box--register'>
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className='auth-form__form'>
              <h1 className='auth-form__heading'>Register</h1>

              {/* Username Field */}
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
                <p className='auth-form__error'>
                  {registerForm.formState.errors.username.message}
                </p>
              )}

              {/* Email Field */}
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
                <p className='auth-form__error'>
                  {registerForm.formState.errors.email.message}
                </p>
              )}

              {/* Password Field - Using PasswordInput Component */}
              <div className='auth-form__input-box'>
                <PasswordInput
                  placeholder='Password (min 6 characters)'
                  {...registerForm.register('password')}
                  disabled={loading}
                  error={registerForm.formState.errors.password?.message}
                />
              </div>

              {/* Confirm Password Field - Using PasswordInput Component */}
              <div className='auth-form__input-box'>
                <PasswordInput
                  placeholder='Confirm Password'
                  {...registerForm.register('confirmPassword')}
                  disabled={loading}
                  error={registerForm.formState.errors.confirmPassword?.message}
                />
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
