import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useOTPInput, useResendTimer } from '@/features/auth/hooks';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';
import '../styles/auth.css';

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [isVerifying, setIsVerifying] = useState(false);

  // Use OTP input hook for managing 6 digits
  const {
    values: otp,
    refs: otpRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    clear: clearOTP,
    focus: focusFirstInput,
    isComplete,
    otp: otpValue,
  } = useOTPInput(6);

  // Use resend timer hook (60 seconds countdown)
  const { timeLeft, canResend, startTimer } = useResendTimer(60);

  // Check if email exists, redirect if not
  useEffect(() => {
    if (!email) {
      toast.error('Email Required', {
        description: 'Please provide an email address',
      });
      navigate(ROUTES.AUTH.LOGIN);
    }

    // Focus first input on mount
    focusFirstInput();
  }, [email, navigate, focusFirstInput]);

  /**
   * Handle OTP verification
   */
  const handleVerify = async () => {
    if (!email) return;

    if (otpValue.length !== 6) {
      toast.error('Invalid OTP', {
        description: 'Please enter all 6 digits',
      });
      return;
    }

    setIsVerifying(true);

    try {
      await authService.verifyEmailWithOTP(email, otpValue);

      toast.success('Email Verified!', {
        description: 'Your email has been successfully verified',
      });

      // Redirect to login after successful verification
      navigate(ROUTES.AUTH.LOGIN);
    } catch (error: any) {
      toast.error('Verification Failed', {
        description: error.message || 'Invalid OTP code',
      });
      clearOTP();
      focusFirstInput();
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handle resend OTP
   */
  const handleResend = async () => {
    if (!email || !canResend) return;

    try {
      await authService.resendVerificationEmail(email);

      toast.success('OTP Sent', {
        description: 'A new OTP has been sent to your email',
      });

      startTimer();
      clearOTP();
      focusFirstInput();
    } catch (error: any) {
      toast.error('Failed to Resend', {
        description: error.message || 'Unable to send OTP',
      });
    }
  };

  /**
   * Handle Enter key press to submit
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isComplete && !isVerifying) {
        handleVerify();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isComplete, isVerifying, otpValue]);

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
            <div className='auth-page__header'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                className='auth-page__back'
                aria-label='Back to login'>
                <ArrowLeft size={20} />
              </Button>

              <div className='auth-page__icon-wrapper'>
                <Mail className='auth-page__icon' size={48} />
              </div>

              <h1 className='auth-page__title'>Verify Your Email</h1>
              <p className='auth-page__subtitle'>
                Enter the 6-digit code sent to
                <br />
                <strong>{email}</strong>
              </p>
            </div>

            <div className='auth-page__form'>
              {/* OTP Input Fields */}
              <div className='auth-page__otp-container'>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (otpRefs.current) {
                        otpRefs.current[index] = el;
                      }
                    }}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className='auth-page__otp-input'
                    disabled={isVerifying}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerify}
                disabled={isVerifying || !isComplete}
                className='auth-page__submit'>
                {isVerifying && (
                  <Loader2 className='animate-spin mr-2' size={16} />
                )}
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </Button>

              {/* Resend Section */}
              <div className='auth-page__resend'>
                <p className='auth-page__resend-text'>
                  Didn't receive the code?{' '}
                  {!canResend && (
                    <span className='text-muted-foreground'>
                      Resend in {timeLeft}s
                    </span>
                  )}
                </p>
                <Button
                  variant='link'
                  onClick={handleResend}
                  className='auth-page__resend-button'
                  disabled={!canResend}>
                  {canResend ? 'Resend Code' : 'Wait to Resend'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </>
  );
}
