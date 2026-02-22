import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/features/profile/hooks/use-profile';
import { useUpdateProfile } from '@/features/profile/hooks/use-update-profile';

const schema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(200).optional(),
  address: z.string().max(100).optional(),
  phoneNumber: z.string().max(20).optional(),
});
type FormData = z.infer<typeof schema>;

export function AccountTab() {
  const { t } = useTranslation('settings');
  const { data: profile } = useProfile();
  const { mutate, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.name ?? '',
      bio: profile?.bio ?? '',
      address: profile?.address ?? '',
      phoneNumber: profile?.phoneNumber ?? '',
    },
  });

  const onSubmit = (data: FormData) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <div className='space-y-1.5'>
        <Label htmlFor='name'>{t('account.name')}</Label>
        <Input id='name' {...register('name')} />
        {errors.name && (
          <p className='text-xs text-destructive'>{errors.name.message}</p>
        )}
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='bio'>{t('account.bio')}</Label>
        <Textarea id='bio' rows={3} {...register('bio')} />
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-1.5'>
          <Label htmlFor='address'>{t('account.address')}</Label>
          <Input id='address' {...register('address')} />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='phone'>{t('account.phone')}</Label>
          <Input id='phone' {...register('phoneNumber')} />
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={!isDirty || isPending}
          className='gap-2'>
          {isPending && <Loader2 size={14} className='animate-spin' />}
          {t('account.save')}
        </Button>
      </div>
    </form>
  );
}
