import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/features/auth/store/auth.store';
import { useChangePassword } from '../hooks/use-change-password';

const schema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(1),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type FormData = z.infer<typeof schema>;

export function SecurityTab() {
  const { t } = useTranslation('settings');
  const { user } = useAuthStore();
  const { mutate, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = ({ currentPassword, newPassword }: FormData) => {
    mutate({ currentPassword, newPassword }, { onSuccess: () => reset() });
  };

  return (
    <div className='space-y-8'>
      {/* ── Change Password ─────────────────────────── */}
      <section className='space-y-4'>
        <h3 className='text-sm font-semibold text-foreground'>
          {t('security.changePassword')}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='currentPassword'>
              {t('security.currentPassword')}
            </Label>
            <Input
              id='currentPassword'
              type='password'
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className='text-xs text-destructive'>
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='newPassword'>{t('security.newPassword')}</Label>
              <Input
                id='newPassword'
                type='password'
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className='text-xs text-destructive'>
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='confirmPassword'>
                {t('security.confirmPassword')}
              </Label>
              <Input
                id='confirmPassword'
                type='password'
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className='text-xs text-destructive'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={!isDirty || isPending}
              className='gap-2'>
              {isPending && <Loader2 size={14} className='animate-spin' />}
              {t('security.updatePassword')}
            </Button>
          </div>
        </form>
      </section>

      <div className='h-px bg-border/40' />

      {/* ── 2FA ─────────────────────────────────────── */}
      <section className='space-y-3'>
        <h3 className='text-sm font-semibold text-foreground'>
          {t('security.twoFactor')}
        </h3>

        <div className='flex items-center justify-between rounded-xl border border-border/40 bg-card p-4'>
          <div className='flex items-center gap-3'>
            {user?.twoFactorEnabled ? (
              <ShieldCheck size={22} className='text-green-500' />
            ) : (
              <ShieldOff size={22} className='text-muted-foreground' />
            )}
            <div>
              <p className='text-sm font-medium'>
                {t('security.twoFactorTitle')}
              </p>
              <p className='text-xs text-muted-foreground'>
                {t('security.twoFactorDesc')}
              </p>
            </div>
          </div>

          <Badge
            variant='outline'
            className={
              user?.twoFactorEnabled
                ? 'border-green-500/30 bg-green-500/10 text-green-500'
                : 'border-border text-muted-foreground'
            }>
            {user?.twoFactorEnabled
              ? t('security.enabled')
              : t('security.disabled')}
          </Badge>
        </div>

        <p className='text-xs text-muted-foreground'>
          {t('security.twoFactorHint')}
        </p>
      </section>
    </div>
  );
}
