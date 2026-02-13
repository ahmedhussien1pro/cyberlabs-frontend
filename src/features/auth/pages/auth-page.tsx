import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Preloader } from '@/components/common/preloader';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';
import { ENV } from '@/shared/constants';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await authService.login(data.email, data.password);

      console.log('Login response:', response);

      // ⬅️ تحسين التعامل مع الـ response
      if (!response || !response.user) {
        console.error('Invalid login response structure:', response);
        throw new Error('Invalid response from server');
      }

      // ⬅️ التعامل مع accessToken أو token
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

      // ⬅️ تحسين التعامل مع الـ response
      if (!response || !response.user) {
        console.error('Invalid register response structure:', response);
        throw new Error('Invalid response from server');
      }

      // ⬅️ التعامل مع accessToken أو token
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

      // ⬅️ تمرير email عبر URL parameters
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

  const handleSocialLogin = (provider: string) => {
    try {
      if (provider === 'Google') {
        // Directly navigate to Google OAuth URL
        const googleAuthUrl = `${ENV.API_URL}/auth/google`;
        window.location.href = googleAuthUrl;
      } else if (provider === 'GitHub') {
        // Directly navigate to GitHub OAuth URL
        const githubAuthUrl = `${ENV.API_URL}/auth/github`;
        window.location.href = githubAuthUrl;
      } else {
        // For Facebook and LinkedIn - coming soon
        toast.info('Coming Soon', {
          description: `${provider} login will be available soon`,
        });
      }
    } catch (error: any) {
      console.error('OAuth error:', error);
      toast.error('OAuth Failed', {
        description: error.message || 'Unable to connect to OAuth provider',
      });
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

              <div className='auth-form__input-box'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  className='auth-form__input'
                  {...loginForm.register('password')}
                  disabled={loading}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='auth-form__input-icon-btn'>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className='auth-form__error'>
                  {loginForm.formState.errors.password.message}
                </p>
              )}

              <div className='auth-form__forgot-link'>
                <Link to={ROUTES.AUTH.FORGOT_PASSWORD}>Forgot password?</Link>
              </div>

              <Button
                type='submit'
                className='auth-form__submit-btn'
                disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <div className='auth-form__divider'>
                <Separator className='flex-1' />
                <span className='px-2 text-muted-foreground text-sm'>
                  or login with
                </span>
                <Separator className='flex-1' />
              </div>

              <div className='auth-form__social-icons'>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('Google')}
                  className='auth-form__social-link'
                  aria-label='Login with Google'>
                  <i className='fa-brands fa-google'></i>
                </button>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('Facebook')}
                  className='auth-form__social-link'
                  aria-label='Login with Facebook'>
                  <i className='fa-brands fa-facebook-f'></i>
                </button>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('GitHub')}
                  className='auth-form__social-link'
                  aria-label='Login with GitHub'>
                  <i className='fa-brands fa-github'></i>
                </button>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('LinkedIn')}
                  className='auth-form__social-link'
                  aria-label='Login with LinkedIn'>
                  <i className='fa-brands fa-linkedin-in'></i>
                </button>
              </div>

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

              <div className='auth-form__input-box'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password (min 6 characters)'
                  className='auth-form__input'
                  {...registerForm.register('password')}
                  disabled={loading}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='auth-form__input-icon-btn'>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {registerForm.formState.errors.password && (
                <p className='auth-form__error'>
                  {registerForm.formState.errors.password.message}
                </p>
              )}

              <div className='auth-form__input-box'>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm Password'
                  className='auth-form__input'
                  {...registerForm.register('confirmPassword')}
                  disabled={loading}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='auth-form__input-icon-btn'>
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {registerForm.formState.errors.confirmPassword && (
                <p className='auth-form__error'>
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}

              <Button
                type='submit'
                className='auth-form__submit-btn'
                disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>

              <div className='auth-form__divider'>
                <Separator className='flex-1' />
                <span className='px-2 text-muted-foreground text-sm'>
                  or register with
                </span>
                <Separator className='flex-1' />
              </div>

              <div className='auth-form__social-icons'>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('Google')}
                  className='auth-form__social-link'
                  aria-label='Register with Google'>
                  <i className='fa-brands fa-google'></i>
                </button>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('Facebook')}
                  className='auth-form__social-link'
                  aria-label='Register with Facebook'>
                  <i className='fa-brands fa-facebook-f'></i>
                </button>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('GitHub')}
                  className='auth-form__social-link'
                  aria-label='Register with GitHub'>
                  <i className='fa-brands fa-github'></i>
                </button>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('LinkedIn')}
                  className='auth-form__social-link'
                  aria-label='Register with LinkedIn'>
                  <i className='fa-brands fa-linkedin-in'></i>
                </button>
              </div>

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
