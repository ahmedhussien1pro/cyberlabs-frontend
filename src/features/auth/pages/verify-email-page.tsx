import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Preloader } from '@/components/common/preloader';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/constants';
import '../styles/auth.css';

type VerificationStatus = 'verifying' | 'success' | 'error' | 'expired';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useAuthStore();

  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Verify email on mount if token exists
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      // No token means user just registered and needs to check email
      setStatus('success');
      setCanResend(true);
    }
  }, [token]);

  // Countdown for auto-redirect after success
  useEffect(() => {
    if (status === 'success' && token && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && status === 'success' && token) {
      navigate(ROUTES.HOME);
    }
  }, [countdown, status, token, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCooldown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [resendCooldown, canResend]);

  const verifyEmail = async (verificationToken: string) => {
    setStatus('verifying');
    try {
      await authService.verifyEmail(verificationToken);
      setStatus('success');
      toast.success('Email Verified!', {
        description: 'Your email has been successfully verified',
      });
    } catch (error: any) {
      if (error.message?.includes('expired')) {
        setStatus('expired');
      } else {
        setStatus('error');
      }
      toast.error('Verification Failed', {
        description: error.message || 'Unable to verify email',
      });
    }
  };

  const handleResendEmail = async () => {
    if (!canResend || resendCooldown > 0) return;

    setLoading(true);
    setCanResend(false);

    try {
      const email = user?.email || '';
      await authService.resendVerificationEmail(email);

      toast.success('Email Sent!', {
        description: 'A new verification link has been sent to your email',
      });

      setResendCooldown(60); // 60 seconds cooldown
    } catch (error: any) {
      toast.error('Failed to Send', {
        description: error.message || 'Please try again',
      });
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipForNow = () => {
    navigate(ROUTES.HOME);
  };

  // Verifying State
  if (status === 'verifying') {
    return (
      <>
        <div className='fixed top-6 right-6 z-50'>
          <ThemeToggle />
        </div>

        <section className='verify-email-page'>
          <motion.div
            className='verify-email-page__container'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <Card className='verify-email-page__card'>
              <div className='verify-email-page__verifying'>
                <div className='verify-email-page__verifying-icon-wrapper'>
                  <Loader2
                    className='verify-email-page__verifying-icon'
                    size={64}
                  />
                </div>
                <h2 className='verify-email-page__verifying-title'>
                  Verifying your email...
                </h2>
                <p className='verify-email-page__verifying-text'>
                  Please wait while we verify your email address
                </p>
              </div>
            </Card>
          </motion.div>
        </section>
      </>
    );
  }

  // Success State (with token - email verified)
  if (status === 'success' && token) {
    return (
      <>
        <div className='fixed top-6 right-6 z-50'>
          <ThemeToggle />
        </div>

        <section className='verify-email-page'>
          <motion.div
            className='verify-email-page__container'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}>
            <Card className='verify-email-page__card'>
              <div className='verify-email-page__success'>
                <motion.div
                  className='verify-email-page__success-icon-wrapper'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}>
                  <CheckCircle
                    className='verify-email-page__success-icon'
                    size={64}
                  />
                </motion.div>
                <h2 className='verify-email-page__success-title'>
                  Email Verified Successfully!
                </h2>
                <p className='verify-email-page__success-text'>
                  Your email has been verified. You can now access all features.
                </p>
                <p className='verify-email-page__success-countdown'>
                  Redirecting in {countdown} seconds...
                </p>

                <Button
                  onClick={() => navigate(ROUTES.HOME)}
                  className='verify-email-page__submit'>
                  Continue to Dashboard
                </Button>
              </div>
            </Card>
          </motion.div>
        </section>
      </>
    );
  }

  // Success State (no token - just registered, needs to check email)
  if (status === 'success' && !token) {
    return (
      <>
        {loading && <Preloader />}

        <div className='fixed top-6 right-6 z-50'>
          <ThemeToggle />
        </div>

        <section className='verify-email-page'>
          <motion.div
            className='verify-email-page__container'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <Card className='verify-email-page__card'>
              <div className='verify-email-page__check'>
                <div className='verify-email-page__check-icon-wrapper'>
                  <Mail className='verify-email-page__check-icon' size={64} />
                </div>
                <h2 className='verify-email-page__check-title'>
                  Check your email
                </h2>
                <p className='verify-email-page__check-text'>
                  We've sent a verification link to
                </p>
                <p className='verify-email-page__check-email'>
                  {user?.email || 'your email address'}
                </p>
                <p className='verify-email-page__check-subtext'>
                  Click the link in the email to verify your account
                </p>

                <Button
                  onClick={() =>
                    window.open('https://mail.google.com', '_blank')
                  }
                  className='verify-email-page__submit'>
                  Open Email App
                </Button>

                <div className='verify-email-page__resend'>
                  <p>Didn't receive the email?</p>
                  <button
                    type='button'
                    onClick={handleResendEmail}
                    disabled={!canResend || resendCooldown > 0}>
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Click to resend'}
                  </button>
                </div>

                <Button
                  variant='ghost'
                  onClick={handleSkipForNow}
                  className='verify-email-page__skip'>
                  Skip for now
                </Button>

                <div className='verify-email-page__back'>
                  <Link to={ROUTES.AUTH.LOGIN}>Back to Login</Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </>
    );
  }

  // Expired State
  if (status === 'expired') {
    return (
      <>
        {loading && <Preloader />}

        <div className='fixed top-6 right-6 z-50'>
          <ThemeToggle />
        </div>

        <section className='verify-email-page'>
          <motion.div
            className='verify-email-page__container'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <Card className='verify-email-page__card'>
              <div className='verify-email-page__expired'>
                <div className='verify-email-page__expired-icon-wrapper'>
                  <XCircle
                    className='verify-email-page__expired-icon'
                    size={64}
                  />
                </div>
                <h2 className='verify-email-page__expired-title'>
                  Verification Link Expired
                </h2>
                <p className='verify-email-page__expired-text'>
                  This verification link has expired for security reasons.
                </p>
                <p className='verify-email-page__expired-subtext'>
                  Please request a new verification link.
                </p>

                <Button
                  onClick={handleResendEmail}
                  disabled={!canResend || resendCooldown > 0}
                  className='verify-email-page__submit'>
                  {resendCooldown > 0 ? (
                    <>
                      <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                      Resend in {resendCooldown}s
                    </>
                  ) : (
                    'Request New Link'
                  )}
                </Button>

                <div className='verify-email-page__back'>
                  <Link to={ROUTES.AUTH.LOGIN}>Back to Login</Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </>
    );
  }

  // Error State
  return (
    <>
      <div className='fixed top-6 right-6 z-50'>
        <ThemeToggle />
      </div>

      <section className='verify-email-page'>
        <motion.div
          className='verify-email-page__container'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <Card className='verify-email-page__card'>
            <div className='verify-email-page__error'>
              <div className='verify-email-page__error-icon-wrapper'>
                <XCircle className='verify-email-page__error-icon' size={64} />
              </div>
              <h2 className='verify-email-page__error-title'>
                Verification Failed
              </h2>
              <p className='verify-email-page__error-text'>
                We couldn't verify your email address.
              </p>
              <p className='verify-email-page__error-subtext'>
                The verification link may be invalid or already used.
              </p>

              <Button
                onClick={handleResendEmail}
                disabled={!canResend || resendCooldown > 0}
                className='verify-email-page__submit'>
                Request New Link
              </Button>

              <div className='verify-email-page__back'>
                <Link to={ROUTES.AUTH.LOGIN}>Back to Login</Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </>
  );
}
