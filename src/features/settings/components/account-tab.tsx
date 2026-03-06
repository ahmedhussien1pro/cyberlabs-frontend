// src/features/settings/components/account-tab.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import {
  Loader2,
  Mail,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/features/profile/hooks/use-profile';
import { useUpdateProfile } from '@/features/profile/hooks/use-update-profile';
import useAuthStore from '@/features/auth/store/auth.store';
import {
  useRequestEmailChange,
  useVerifyEmailChange,
} from '../hooks/use-change-email';

// ── Schemas ──────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(200).optional(),
  address: z.string().max(100).optional(),
  phoneNumber: z.string().max(20).optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const emailSchema = z.object({
  newEmail: z.string().email(),
});
type EmailForm = z.infer<typeof emailSchema>;

const otpSchema = z.object({
  otp: z.string().min(4).max(8),
});
type OtpForm = z.infer<typeof otpSchema>;

// ─────────────────────────────────────────────────────────────

export function AccountTab() {
  const { t } = useTranslation('settings');
  const { data: profile } = useProfile();
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [emailStep, setEmailStep] = useState<'idle' | 'request' | 'verify'>(
    'idle',
  );
  const [emailToken, setEmailToken] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  const requestEmail = useRequestEmailChange();
  const verifyEmail = useVerifyEmailChange();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? '',
      bio: profile?.bio ?? '',
      address: profile?.address ?? '',
      phoneNumber: profile?.phoneNumber ?? '',
    },
  });

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });
  const otpForm = useForm<OtpForm>({ resolver: zodResolver(otpSchema) });

  const onSaveProfile = (data: ProfileForm) => updateProfile(data);

  const onRequestEmail = (data: EmailForm) => {
    setPendingEmail(data.newEmail);
    requestEmail.mutate(data.newEmail, {
      onSuccess: (res) => {
        setEmailToken(res.token);
        setEmailStep('verify');
      },
    });
  };

  const onVerifyOtp = (data: OtpForm) => {
    verifyEmail.mutate(
      { otp: data.otp, token: emailToken },
      {
        onSuccess: () => {
          setEmailStep('idle');
          otpForm.reset();
          emailForm.reset();
        },
      },
    );
  };

  const cancelEmailChange = () => {
    setEmailStep('idle');
    emailForm.reset();
    otpForm.reset();
  };

  return (
    <div className='space-y-8'>
      {/* ── Email ────────────────────────────────────── */}
      <section className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-foreground'>
            {t('account.emailSection')}
          </h3>
          {user?.emailVerified && (
            <Badge
              variant='outline'
              className='gap-1 border-green-500/20 bg-green-500/5 text-[10px] text-green-500'>
              <CheckCircle2 size={9} />
              {t('account.verified')}
            </Badge>
          )}
        </div>

        {emailStep === 'idle' && (
          <div className='flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 px-4 py-3'>
            <Mail size={15} className='shrink-0 text-muted-foreground' />
            <span className='flex-1 truncate text-sm font-medium'>
              {user?.email}
            </span>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setEmailStep('request')}>
              {t('account.changeEmail')}
            </Button>
          </div>
        )}

        {emailStep === 'request' && (
          <form
            onSubmit={emailForm.handleSubmit(onRequestEmail)}
            className='space-y-3 rounded-xl border border-primary/20 bg-primary/[0.02] p-4'>
            <p className='text-xs text-muted-foreground'>
              {t('account.changeEmailDesc')}
            </p>
            <div className='flex flex-wrap gap-2'>
              <Input
                type='email'
                placeholder={t('account.newEmailPlaceholder')}
                {...emailForm.register('newEmail')}
                className='h-9 flex-1'
              />
              <Button
                type='submit'
                size='sm'
                disabled={requestEmail.isPending}
                className='gap-1.5'>
                {requestEmail.isPending ? (
                  <Loader2 size={13} className='animate-spin' />
                ) : (
                  <ArrowRight size={13} />
                )}
                {t('account.sendOtp')}
              </Button>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                onClick={cancelEmailChange}>
                {t('cancel')}
              </Button>
            </div>
            {emailForm.formState.errors.newEmail && (
              <p className='text-xs text-destructive'>
                {emailForm.formState.errors.newEmail.message}
              </p>
            )}
          </form>
        )}

        {emailStep === 'verify' && (
          <form
            onSubmit={otpForm.handleSubmit(onVerifyOtp)}
            className='space-y-3 rounded-xl border border-primary/20 bg-primary/[0.02] p-4'>
            <p className='text-xs text-muted-foreground'>
              {t('account.otpSent')}{' '}
              <span className='font-semibold text-foreground'>
                {pendingEmail}
              </span>
            </p>
            <div className='flex flex-wrap gap-2'>
              <Input
                placeholder={t('account.otpPlaceholder')}
                maxLength={8}
                {...otpForm.register('otp')}
                className='h-9 flex-1 font-mono tracking-[0.4em]'
              />
              <Button
                type='submit'
                size='sm'
                disabled={verifyEmail.isPending}
                className='gap-1.5'>
                {verifyEmail.isPending && (
                  <Loader2 size={13} className='animate-spin' />
                )}
                {t('account.verifyOtp')}
              </Button>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                onClick={cancelEmailChange}>
                {t('cancel')}
              </Button>
            </div>
            {otpForm.formState.errors.otp && (
              <p className='text-xs text-destructive'>
                {otpForm.formState.errors.otp.message}
              </p>
            )}
            <button
              type='button'
              className='text-xs text-primary underline-offset-2 hover:underline disabled:opacity-50'
              disabled={requestEmail.isPending}
              onClick={() =>
                requestEmail.mutate(pendingEmail, {
                  onSuccess: (res) => setEmailToken(res.token),
                })
              }>
              {t('account.resendOtp')}
            </button>
          </form>
        )}
      </section>

      <div className='h-px bg-border/40' />

      {/* ── Profile Info ─────────────────────────────── */}
      <section className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-foreground'>
            {t('account.profileInfo')}
          </h3>
          <Button
            asChild
            variant='ghost'
            size='sm'
            className='h-7 gap-1.5 text-xs text-muted-foreground'>
            <Link to='/profile'>
              <ExternalLink size={11} />
              {t('account.viewProfile')}
            </Link>
          </Button>
        </div>

        <form
          onSubmit={profileForm.handleSubmit(onSaveProfile)}
          className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='name'>{t('account.name')}</Label>
            <Input id='name' {...profileForm.register('name')} />
            {profileForm.formState.errors.name && (
              <p className='text-xs text-destructive'>
                {profileForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='bio'>{t('account.bio')}</Label>
            <Textarea id='bio' rows={3} {...profileForm.register('bio')} />
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='address'>{t('account.address')}</Label>
              <Input id='address' {...profileForm.register('address')} />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='phone'>{t('account.phone')}</Label>
              <Input id='phone' {...profileForm.register('phoneNumber')} />
            </div>
          </div>

          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={!profileForm.formState.isDirty || isPending}
              className='gap-2'>
              {isPending && <Loader2 size={14} className='animate-spin' />}
              {t('account.save')}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
