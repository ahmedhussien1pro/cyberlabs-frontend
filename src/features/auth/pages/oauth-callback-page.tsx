import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/constants';

import './oauth-callback-page.css';

type CallbackStatus = 'processing' | 'success' | 'error';
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  const [status, setStatus] = useState<CallbackStatus>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const provider = searchParams.get('provider') || 'google';
  const state = searchParams.get('state');

  useEffect(() => {
    const handleCallback = async () => {
      // Check for error from OAuth provider
      if (error) {
        setStatus('error');
        setErrorMessage('Authentication was cancelled or failed');
        toast.error('Authentication Failed', {
          description: 'Please try again',
        });
        return;
      }

      // Check for code
      if (!code) {
        setStatus('error');
        setErrorMessage('No authorization code received');
        toast.error('Invalid Callback', {
          description: 'Missing authorization code',
        });
        return;
      }

      // Process OAuth callback
      try {
        let response;

        if (provider === 'google') {
          response = await authService.googleCallback(code, state || '');
        } else if (provider === 'github') {
          response = await authService.githubCallback(code, state || '');
        } else {
          throw new Error('Unsupported OAuth provider');
        }

        // Login user
        login(response.user, response.token);

        setStatus('success');

        toast.success('Login Successful!', {
          description: `Welcome ${response.user.name}!`,
        });

        setTimeout(() => {
          navigate(ROUTES.HOME);
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.message || 'Authentication failed');

        toast.error('Authentication Failed', {
          description: error.message || 'Please try again',
        });
      }
    };

    handleCallback();
  }, [code, error, provider, state, login, navigate]);

  const getProviderName = () => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'github':
        return 'GitHub';
      default:
        return 'Provider';
    }
  };

  const getProviderIcon = () => {
    switch (provider) {
      case 'google':
        return <i className='fa-brands fa-google text-4xl'></i>;
      case 'github':
        return <i className='fa-brands fa-github text-4xl'></i>;
      default:
        return <Loader2 className='text-primary' size={48} />;
    }
  };

  return (
    <>
      <div className='fixed top-6 right-6 z-50'>
        <ThemeToggle />
      </div>

      <section className='oauth-callback-page'>
        <motion.div
          className='oauth-callback-page__container'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <Card className='oauth-callback-page__card'>
            {status === 'processing' && (
              <div className='oauth-callback-page__processing'>
                <div className='oauth-callback-page__icon-wrapper'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}>
                    {getProviderIcon()}
                  </motion.div>
                </div>
                <h2 className='oauth-callback-page__title'>
                  Authenticating with {getProviderName()}...
                </h2>
                <p className='oauth-callback-page__text'>
                  Please wait while we complete your authentication
                </p>
                <div className='oauth-callback-page__loader'>
                  <motion.div
                    className='oauth-callback-page__loader-bar'
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            )}

            {status === 'success' && (
              <motion.div
                className='oauth-callback-page__success'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}>
                <motion.div
                  className='oauth-callback-page__success-icon-wrapper'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}>
                  <CheckCircle
                    className='oauth-callback-page__success-icon'
                    size={64}
                  />
                </motion.div>
                <h2 className='oauth-callback-page__success-title'>
                  Authentication Successful!
                </h2>
                <p className='oauth-callback-page__success-text'>
                  You've successfully logged in with {getProviderName()}
                </p>
                <p className='oauth-callback-page__success-subtext'>
                  Redirecting you to dashboard...
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <div className='oauth-callback-page__error'>
                <div className='oauth-callback-page__error-icon-wrapper'>
                  <XCircle
                    className='oauth-callback-page__error-icon'
                    size={64}
                  />
                </div>
                <h2 className='oauth-callback-page__error-title'>
                  Authentication Failed
                </h2>
                <p className='oauth-callback-page__error-text'>
                  {errorMessage}
                </p>
                <Button
                  onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                  className='oauth-callback-page__button'>
                  Back to Login
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </section>
    </>
  );
}
