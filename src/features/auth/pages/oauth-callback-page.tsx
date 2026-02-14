import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/constants';
import '../styles/auth.css';
import { tokenUtils, roleUtils } from '@/features/auth/utils';
type CallbackStatus = 'processing' | 'success' | 'error';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  const [status, setStatus] = useState<CallbackStatus>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Get parameters from URL
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const expiresIn = searchParams.get('expires_in');
  const error = searchParams.get('error');

  useEffect(() => {
    // Check if there's an error from OAuth provider
    if (error) {
      setStatus('error');
      setErrorMessage(`OAuth error: ${error}`);
      toast.error('Authentication Failed', {
        description: `OAuth provider returned an error: ${error}`,
      });
      return;
    }

    // Check if we have tokens
    if (!accessToken) {
      setStatus('error');
      setErrorMessage('Missing authentication token');
      toast.error('Authentication Failed', {
        description: 'No access token received from OAuth provider',
      });
      return;
    }

    // Process OAuth tokens
    handleOAuthTokens(accessToken, refreshToken || '');
  }, [accessToken, refreshToken, error]);

  const handleOAuthTokens = async (token: string, refresh: string) => {
    try {
      // Decode JWT to get user info using centralized utility
      const decoded = tokenUtils.decode(token);
      // Extract name from email (before @)
      const emailName = decoded.email.split('@')[0];
      const userName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

      // Create user object from decoded token
      const user = {
        id: decoded.sub,
        email: decoded.email,
        name: userName,
        role: roleUtils.mapBackendRole(decoded.role),
      };

      // Login user with token
      login(user, token);

      // Store refresh token if provided
      if (refresh) {
        const storagePrefix = 'cyberlabs_';
        localStorage.setItem(`${storagePrefix}refreshToken`, refresh);
      }

      setStatus('success');

      toast.success('Welcome!', {
        description: `Successfully logged in as ${user.name}`,
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 2000);
    } catch (err: any) {
      console.error('OAuth token processing error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to process authentication token');

      toast.error('Authentication Failed', {
        description: err.message || 'Unable to complete OAuth login',
      });
    }
  };

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
            {status === 'processing' && (
              <div className='auth-page__verifying'>
                <div className='auth-page__verifying-icon-wrapper'>
                  <Loader2 className='auth-page__verifying-icon' size={64} />
                </div>
                <h2 className='auth-page__verifying-title'>
                  Authenticating...
                </h2>
                <p className='auth-page__verifying-text'>
                  Please wait while we complete your login
                </p>
              </div>
            )}

            {status === 'success' && (
              <motion.div
                className='auth-page__success'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}>
                <div className='auth-page__success-icon-wrapper'>
                  <CheckCircle className='auth-page__success-icon' size={64} />
                </div>
                <h2 className='auth-page__success-title'>Login Successful!</h2>
                <p className='auth-page__success-text'>
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                className='auth-page__error'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}>
                <div className='auth-page__error-icon-wrapper'>
                  <XCircle className='auth-page__error-icon' size={64} />
                </div>
                <h2 className='auth-page__error-title'>
                  Authentication Failed
                </h2>
                <p className='auth-page__error-text'>
                  {errorMessage || 'Unable to complete OAuth login'}
                </p>

                <Button
                  onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                  className='auth-page__submit'>
                  Back to Login
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </section>
    </>
  );
}
