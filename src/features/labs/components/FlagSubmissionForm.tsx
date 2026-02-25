import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const flagSchema = z.object({
  flag: z
    .string()
    .min(5, 'Flag is too short')
    .regex(/^CyberLabs\{.*\}$/, 'Invalid flag format (e.g., CyberLabs{...})'),
});

type FlagFormValues = z.infer<typeof flagSchema>;

export const FlagSubmissionForm: React.FC<{ labId: string }> = ({ labId }) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FlagFormValues>({
    resolver: zodResolver(flagSchema),
  });

  const onSubmit = async (data: FlagFormValues) => {
    // TODO: إرسال الـ Flag للـ API للتحقق عبر TanStack Query
    console.log(`Submitting flag for ${labId}:`, data.flag);
    toast.success(t('labs.workspace.flagCorrect'));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 pt-4 border-t border-border'>
      <h3 className='font-semibold'>{t('labs.workspace.submitFlag')}</h3>
      <div className='flex gap-2'>
        <div className='flex-1'>
          <Input
            {...register('flag')}
            placeholder='CyberLabs{...}'
            className={errors.flag ? 'border-destructive' : ''}
          />
        </div>
        <Button type='submit' disabled={isSubmitting}>
          {t('labs.workspace.submit')}
        </Button>
      </div>
      {errors.flag && (
        <p className='text-sm text-destructive'>
          {errors.flag.message as string}
        </p>
      )}
    </form>
  );
};
