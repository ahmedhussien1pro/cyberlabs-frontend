// src/features/auth/pages/otp-verification-page.tsx
'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Preloader } from '@/components/common/preloader';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';

import '../styles/otp-verification-page.css';

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 30; // seconds

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(RESEND_COUNTDOWN);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error('Email Required', {
        description: 'Please register or login first',
      });
      navigate(ROUTES.AUTH.LOGIN);
    }
  }, [email, navigate]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown]);

  // Auto-submit when all fields filled
  useEffect(() => {
    const otpCode = otp.join('');
    if (otpCode.length === OTP_LENGTH && !loading && !verified) {
      handleVerifyOTP(otpCode);
    }
  }, [otp, loading, verified]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Only process if it's all digits
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];

      digits.forEach((digit, index) => {
        if (index < OTP_LENGTH) {
          newOtp[index] = digit;
        }
      });

      setOtp(newOtp);

      // Focus last filled input or next empty
      const lastFilledIndex = Math.min(digits.length, OTP_LENGTH) - 1;
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    setLoading(true);
    try {
      await authService.verifyEmailWithOTP(email, otpCode);

      setVerified(true);

      toast.success('Email Verified Successfully!', {
        description: 'Your account is now active',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 2000);
    } catch (error: any) {
      toast.error('Verification Failed', {
        description: error.message || 'Invalid OTP code',
      });

      // Clear OTP and refocus first input
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || loading) return;

    setLoading(true);
    setCanResend(false);

    try {
      await authService.resendVerificationEmail(email);

      toast.success('OTP Sent!', {
        description: 'A new verification code has been sent to your email',
      });

      // Reset countdown
      setResendCountdown(RESEND_COUNTDOWN);

      // Clear OTP inputs
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error('Failed to Send', {
        description: error.message || 'Please try again',
      });
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email: string) => {
    if (!email) return '****@****.com';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return '****@****.com';

    const maskedLocal =
      localPart.length > 2
        ? localPart[0] +
          '*'.repeat(localPart.length - 2) +
          localPart[localPart.length - 1]
        : localPart;

    return `${maskedLocal}@${domain}`;
  };

  // Success State
  if (verified) {
    return (
      <>
        <div className='fixed top-6 right-6 z-50'>
          <ThemeToggle />
        </div>

        <section className='otp-page'>
          <motion.div
            className='otp-page__container'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}>
            <Card className='otp-page__card'>
              <div className='otp-page__success'>
                <motion.div
                  className='otp-page__success-icon-wrapper'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}>
                  <CheckCircle className='otp-page__success-icon' size={64} />
                </motion.div>
                <h2 className='otp-page__success-title'>Verified!</h2>
                <p className='otp-page__success-text'>
                  Your email has been successfully verified
                </p>
                <p className='otp-page__success-subtext'>
                  Redirecting you to dashboard...
                </p>
              </div>
            </Card>
          </motion.div>
        </section>
      </>
    );
  }

  // Main OTP Form
  return (
    <>
      {loading && <Preloader />}

      <div className='fixed top-6 right-6 z-50'>
        <ThemeToggle />
      </div>

      <section className='otp-page'>
        <motion.div
          className='otp-page__container'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <Card className='otp-page__card'>
            {/* Header */}
            <div className='otp-page__header'>
              <div className='otp-page__icon-wrapper'>
                <Mail className='otp-page__icon' size={48} />
              </div>
              <h1 className='otp-page__title'>Verify Your Email</h1>
              <p className='otp-page__subtitle'>We've sent a 6-digit code to</p>
              <p className='otp-page__email'>{maskEmail(email)}</p>
            </div>

            {/* OTP Inputs */}
            <div className='otp-page__inputs' onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className='otp-page__input'
                  disabled={loading || verified}
                  autoComplete='off'
                />
              ))}
            </div>

            {/* Resend Section */}
            <div className='otp-page__resend'>
              <p className='otp-page__resend-text'>Didn't receive the code?</p>
              <Button
                type='button'
                variant='link'
                onClick={handleResendOTP}
                disabled={!canResend || loading}
                className='otp-page__resend-btn'>
                <RefreshCw
                  size={16}
                  className={loading ? 'animate-spin' : ''}
                />
                {canResend ? 'Resend Code' : `Resend in ${resendCountdown}s`}
              </Button>
            </div>

            {/* Back Link */}
            <div className='otp-page__back'>
              <ArrowLeft size={16} />
              <Link to={ROUTES.AUTH.LOGIN}>Back to Login</Link>
            </div>
          </Card>
        </motion.div>
      </section>
    </>
  );
}
