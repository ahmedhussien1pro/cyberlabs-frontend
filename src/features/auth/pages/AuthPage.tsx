import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '@/core/api/authApi';
import { useAuthStore } from '@/features/auth/stores/authStore';
import './AuthPage.css';

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const { login: setAuth } = useAuthStore();
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('auth.loginError'));
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success(t('auth.registerSuccess'));
      setIsActive(false);
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('auth.registerError'));
    },
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }
    registerMutation.mutate({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
    });
  };

  return (
    <section className='auth-form primary-bg'>
      <div className={\uth-form__container secondary-bg rounded-3 \\}>
        
        {/* Login Form */}
        <div className='auth-form__form-box auth-form__form-box--login'>
          <form onSubmit={handleLoginSubmit} className='auth-form__form'>
            <h1 className='auth-form__heading text-center main-color'>
              {t('auth.login')}
            </h1>
            
            <div className='auth-form__input-box'>
              <input
                type='email'
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                placeholder={t('auth.email')}
                required
                className='auth-form__input'
                autoComplete='email'
              />
              <i className='auth-form__input-icon fa-solid fa-envelope'></i>
            </div>

            <div className='auth-form__input-box'>
              <input
                type='password'
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder={t('auth.password')}
                required
                className='auth-form__input'
                autoComplete='current-password'
              />
              <i className='auth-form__input-icon fa-solid fa-lock'></i>
            </div>

            <div className='auth-form__forgot-link'>
              <Link to='/forgot-password'>{t('auth.forgotPassword')}</Link>
            </div>

            <button
              type='submit'
              className='auth-form__submit-btn'
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? t('auth.loggingIn') : t('auth.login')}
            </button>

            <p className='auth-form__divider'>
              {t('auth.orLoginWith')}
            </p>

            <div className='auth-form__social-icons'>
              <a href='#' className='auth-form__social-link' aria-label='Google'>
                <i className='fa-brands fa-google'></i>
              </a>
              <a href='#' className='auth-form__social-link' aria-label='Facebook'>
                <i className='fa-brands fa-facebook-f'></i>
              </a>
              <a href='#' className='auth-form__social-link' aria-label='GitHub'>
                <i className='fa-brands fa-github'></i>
              </a>
              <a href='#' className='auth-form__social-link' aria-label='LinkedIn'>
                <i className='fa-brands fa-linkedin-in'></i>
              </a>
            </div>

            <div className='auth-form__switch-link d-md-none'>
              {t('auth.dontHaveAccount')}{' '}
              <a href='#' onClick={(e) => { e.preventDefault(); setIsActive(true); }}>
                {t('auth.register')}
              </a>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className='auth-form__form-box auth-form__form-box--register'>
          <form onSubmit={handleRegisterSubmit} className='auth-form__form'>
            <h1 className='auth-form__heading text-center main-color'>
              {t('auth.register')}
            </h1>
            
            <div className='auth-form__input-box'>
              <input
                type='text'
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                placeholder={t('auth.name')}
                required
                className='auth-form__input'
              />
              <i className='auth-form__input-icon fa-solid fa-user'></i>
            </div>

            <div className='auth-form__input-box'>
              <input
                type='email'
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                placeholder={t('auth.email')}
                required
                className='auth-form__input'
              />
              <i className='auth-form__input-icon fa-solid fa-envelope'></i>
            </div>

            <div className='auth-form__input-box'>
              <input
                type='password'
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                placeholder={t('auth.password')}
                required
                minLength={6}
                className='auth-form__input'
              />
              <i className='auth-form__input-icon fa-solid fa-lock'></i>
            </div>

            <div className='auth-form__input-box'>
              <input
                type='password'
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                placeholder={t('auth.confirmPassword')}
                required
                className='auth-form__input'
              />
              <i className='auth-form__input-icon fa-solid fa-lock'></i>
            </div>

            <button
              type='submit'
              className='auth-form__submit-btn'
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? t('auth.registering') : t('auth.register')}
            </button>

            <p className='auth-form__divider'>
              {t('auth.orRegisterWith')}
            </p>

            <div className='auth-form__social-icons'>
              <a href='#' className='auth-form__social-link'>
                <i className='fa-brands fa-google'></i>
              </a>
              <a href='#' className='auth-form__social-link'>
                <i className='fa-brands fa-facebook-f'></i>
              </a>
              <a href='#' className='auth-form__social-link'>
                <i className='fa-brands fa-github'></i>
              </a>
              <a href='#' className='auth-form__social-link'>
                <i className='fa-brands fa-linkedin-in'></i>
              </a>
            </div>

            <div className='auth-form__switch-link d-md-none'>
              {t('auth.alreadyHaveAccount')}{' '}
              <a href='#' onClick={(e) => { e.preventDefault(); setIsActive(false); }}>
                {t('auth.login')}
              </a>
            </div>
          </form>
        </div>

        {/* Toggle Panels - Desktop Only */}
        <div className='auth-form__toggle-box d-none d-md-block'>
          <div className='auth-form__toggle-panel auth-form__toggle-panel--left'>
            <h1 className='auth-form__toggle-heading'>{t('auth.helloWelcome')}</h1>
            <p className='auth-form__toggle-text'>{t('auth.dontHaveAccount')}</p>
            <button onClick={() => setIsActive(true)} className='auth-form__toggle-btn' type='button'>
              {t('auth.register')}
            </button>
          </div>
          <div className='auth-form__toggle-panel auth-form__toggle-panel--right'>
            <h1 className='auth-form__toggle-heading'>{t('auth.welcomeBack')}</h1>
            <p className='auth-form__toggle-text'>{t('auth.alreadyHaveAccount')}</p>
            <button onClick={() => setIsActive(false)} className='auth-form__toggle-btn' type='button'>
              {t('auth.login')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
