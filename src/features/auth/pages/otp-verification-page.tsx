import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { OTPInputs, ResendButton } from '@/features/auth/components';
import { useResendTimer } from '@/features/auth/hooks';
import { authService } from '@/features/auth/services/auth.service';
import { ROUTES } from '@/shared/constants';
import '../styles/auth.css';
import { LanguageSwitcher } from '@/components/common/language-switcher';

export default function OTPVerificationPage() {
  const { t } = useTranslation('otpVerification');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

  const { timeLeft, canResend, startTimer } = useResendTimer(60);

  useEffect(() => {
    if (!email) {
      toast.error(t('toast.emailRequired'), {
        description: t('toast.emailRequiredDescription'),
      });
      navigate(ROUTES.AUTH.LOGIN);
    }
  }, [email, navigate, t]);

  const handleVerify = async (otpCode?: string) => {
    if (!email || isVerifying) return;

    const otpValue = otpCode ?? otp.join('');

    if (otpValue.length !== 6) {
      toast.error(t('toast.invalidOTP'), {
        description: t('toast.invalidOTPDescription'),
      });
      return;
    }

    setIsVerifying(true);

    try {
      await authService.verifyEmailWithOTP(email, otpValue);

      toast.success(t('toast.verified'), {
        description: t('toast.verifiedDescription'),
      });

      navigate(ROUTES.AUTH.LOGIN);
    } catch (error: any) {
      toast.error(t('toast.verificationFailed'), {
        description: error.message || t('toast.invalidCode'),
      });
      setOtp(Array(6).fill(''));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || !canResend) return;

    try {
      await authService.resendVerificationEmail(email);

      toast.success(t('toast.otpSent'), {
        description: t('toast.otpSentDescription'),
      });

      startTimer(40);
      setOtp(Array(6).fill(''));
    } catch (error: any) {
      toast.error(t('toast.resendFailed'), {
        description: error.message || t('toast.unableToSend'),
      });
    }
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <>
      <div className='fixed top-6 right-6 z-50'>
        <ThemeToggle />
        <LanguageSwitcher />
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
                aria-label={t('backToLogin')}>
                <ArrowLeft size={20} />
              </Button>

              <div className='auth-page__icon-wrapper'>
                <Mail className='auth-page__icon' size={48} />
              </div>

              <h1 className='auth-page__title'>{t('title')}</h1>
              <p className='auth-page__subtitle'>
                {t('subtitle')}
                <br />
                <strong>{email}</strong>
              </p>
            </div>

            <div className='auth-page__form'>
              <div className='auth-page__otp-container'>
                <OTPInputs
                  value={otp}
                  onChange={setOtp}
                  length={6}
                  disabled={isVerifying}
                  autoSubmit={true}
                  onComplete={handleVerify}
                />
              </div>

              <Button
                onClick={() => handleVerify()}
                disabled={isVerifying || !isComplete}
                className='auth-page__submit'>
                {isVerifying && (
                  <Loader2 className='animate-spin mr-2' size={16} />
                )}
                {isVerifying ? t('verifyingButton') : t('verifyButton')}
              </Button>

              <ResendButton
                canResend={canResend}
                countdown={timeLeft}
                onResend={handleResend}
                loading={false}
                text={t('resendButton')}
              />
            </div>
          </Card>
        </motion.div>
      </section>
    </>
  );
}
