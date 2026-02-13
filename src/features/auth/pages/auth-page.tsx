import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// import { useAuth } from '@/features/auth/hooks/use-auth'; there are useLogin and useRegister hooks in useAuth, so we can import them directly
import { useLogin } from '../hooks/use-auth';
import { useRegister } from '../hooks/use-auth';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import './auth-page.css';

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();
  const register = useRegister();
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const togglePanel = () => {
    setIsActive(!isActive);
    setLoginForm({ email: '', password: '' });
    setRegisterForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync(loginForm);
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerForm.password.length < 6) {
      alert(t('auth.passwordTooShort'));
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      alert(t('auth.passwordMismatch'));
      return;
    }

    try {
      await register.mutateAsync({
        name: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
      });
      navigate('/authenticate');
    } catch (error) {
      console.error('Register failed:', error);
    }
  };

  return (
    <section className='auth-form'>
      <div
        className={`auth-form__container ${isActive ? 'auth-form__container--active' : ''}`}>
        {/* Login Form */}
        <div className='auth-form__form-box auth-form__form-box--login'>
          <form onSubmit={handleLoginSubmit} className='auth-form__form'>
            <h1 className='auth-form__heading'>{t('auth.login')}</h1>

            <div className='auth-form__input-box'>
              <Input
                type='email'
                name='email'
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                placeholder={t('auth.email')}
                required
                className='auth-form__input'
                autoComplete='email'
              />
              <Mail className='auth-form__input-icon' size={16} />
            </div>

            <div className='auth-form__input-box'>
              <Input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                placeholder={t('auth.password')}
                required
                className='auth-form__input'
                autoComplete='current-password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='auth-form__input-icon auth-form__input-icon--button'>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className='auth-form__forgot-link'>
              <Link to='/forgot-password'>{t('auth.forgotPassword')}</Link>
            </div>

            <Button
              type='submit'
              className='auth-form__submit-btn'
              disabled={login.isPending}>
              {login.isPending ? t('auth.loggingIn') : t('auth.login')}
            </Button>

            <p className='auth-form__divider'>{t('auth.orLoginWith')}</p>

            <div className='auth-form__social-icons'>
              <Link
                to='#'
                className='auth-form__social-link'
                aria-label='Login with Google'>
                <i className='fa-brands fa-google'></i>
              </Link>
              <Link
                to='#'
                className='auth-form__social-link'
                aria-label='Login with Facebook'>
                <i className='fa-brands fa-facebook-f'></i>
              </Link>
              <Link
                to='#'
                className='auth-form__social-link'
                aria-label='Login with GitHub'>
                <i className='fa-brands fa-github'></i>
              </Link>
              <Link
                to='#'
                className='auth-form__social-link'
                aria-label='Login with LinkedIn'>
                <i className='fa-brands fa-linkedin-in'></i>
              </Link>
            </div>

            <div className='auth-form__switch-link d-md-none'>
              {t('auth.dontHaveAccount')}{' '}
              <Link
                to='#'
                onClick={(e) => {
                  e.preventDefault();
                  togglePanel();
                }}>
                {t('auth.register')}
              </Link>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className='auth-form__form-box auth-form__form-box--register'>
          <form onSubmit={handleRegisterSubmit} className='auth-form__form'>
            <h1 className='auth-form__heading'>{t('auth.register')}</h1>

            <div className='auth-form__input-box'>
              <Input
                type='text'
                name='username'
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, username: e.target.value })
                }
                placeholder={t('auth.username')}
                required
                className='auth-form__input'
                autoComplete='username'
              />
              <User className='auth-form__input-icon' size={16} />
            </div>

            <div className='auth-form__input-box'>
              <Input
                type='email'
                name='email'
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                placeholder={t('auth.email')}
                required
                className='auth-form__input'
                autoComplete='email'
              />
              <Mail className='auth-form__input-icon' size={16} />
            </div>

            <div className='auth-form__input-box'>
              <Input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                placeholder={t('auth.passwordMin6')}
                required
                className='auth-form__input'
                autoComplete='new-password'
                minLength={6}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='auth-form__input-icon auth-form__input-icon--button'>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className='auth-form__input-box'>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                value={registerForm.confirmPassword}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder={t('auth.confirmPassword')}
                required
                className='auth-form__input'
                autoComplete='new-password'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='auth-form__input-icon auth-form__input-icon--button'>
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button
              type='submit'
              className='auth-form__submit-btn'
              disabled={register.isPending}>
              {register.isPending ? t('auth.registering') : t('auth.register')}
            </Button>

            <p className='auth-form__divider'>{t('auth.orRegisterWith')}</p>

            <div className='auth-form__social-icons'>
              <Link
                to='#'
                className='auth-form__social-link'
                aria-label='Register with Google'>
                <i className='fa-brands fa-google'></i>
              </Link>
              <Link
                to='#'
                className='auth-form__social-link'
                aria-label='Register with Facebook'>
                <i className='fa-brands fa-facebook-f'></i>
              </Link>
              <Link
                to='#'
                className='auth-form__social-link'
                aria-label='Register with GitHub'>
                <i className='fa-brands fa-github'></i>
              </Link>
              <Link
                to='#'
                className='auth-form__social-link'
                aria-label='Register with LinkedIn'>
                <i className='fa-brands fa-linkedin-in'></i>
              </Link>
            </div>

            <div className='auth-form__switch-link d-md-none'>
              {t('auth.alreadyHaveAccount')}{' '}
              <Link
                to='#'
                onClick={(e) => {
                  e.preventDefault();
                  togglePanel();
                }}>
                {t('auth.login')}
              </Link>
            </div>
          </form>
        </div>

        {/* Toggle Panels - Desktop Only */}
        <div className='auth-form__toggle-box d-none d-md-block'>
          <div className='auth-form__toggle-panel auth-form__toggle-panel--left'>
            <h1 className='auth-form__toggle-heading'>
              {t('auth.helloWelcome')}
            </h1>
            <p className='auth-form__toggle-text'>
              {t('auth.dontHaveAccount')}
            </p>
            <button
              onClick={togglePanel}
              className='auth-form__toggle-btn'
              type='button'>
              {t('auth.register')}
            </button>
          </div>
          <div className='auth-form__toggle-panel auth-form__toggle-panel--right'>
            <h1 className='auth-form__toggle-heading'>
              {t('auth.welcomeBack')}
            </h1>
            <p className='auth-form__toggle-text'>
              {t('auth.alreadyHaveAccount')}
            </p>
            <button
              onClick={togglePanel}
              className='auth-form__toggle-btn'
              type='button'>
              {t('auth.login')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
