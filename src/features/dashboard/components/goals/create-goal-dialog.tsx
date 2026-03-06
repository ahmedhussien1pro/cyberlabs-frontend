import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateGoal } from '../../hooks/use-goals-data';

const CATS = ['labs', 'courses', 'xp', 'streak', 'custom'] as const;

const schema = z.object({
  title: z.string().min(1).max(100),
  category: z.enum(CATS),
  targetValue: z.coerce.number().int().min(1),
  unit: z.string().min(1).max(20),
  dueDate: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateGoalDialog({ open, onClose }: Props) {
  const { t } = useTranslation('dashboard');
  const create = useCreateGoal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'labs', targetValue: 10, unit: 'labs' },
    mode: 'onChange',
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormData) =>
    create.mutate(data, { onSuccess: close });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>{t('goals.createTitle')}</DialogTitle>
          <DialogDescription>{t('goals.createDesc')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Title */}
          <div className='space-y-1.5'>
            <Label htmlFor='g-title'>{t('goals.form.title')}</Label>
            <Input
              id='g-title'
              {...register('title')}
              placeholder={t('goals.form.titlePlaceholder')}
            />
            {errors.title && (
              <p className='text-xs text-destructive'>{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div className='space-y-1.5'>
            <Label>{t('goals.form.category')}</Label>
            <Select
              value={watch('category')}
              onValueChange={(v) =>
                setValue('category', v as FormData['category'], {
                  shouldValidate: true,
                })
              }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {t(`goals.category.${c}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target + Unit */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='g-target'>{t('goals.form.target')}</Label>
              <Input
                id='g-target'
                type='number'
                min={1}
                {...register('targetValue')}
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='g-unit'>{t('goals.form.unit')}</Label>
              {/* ✅ Fix: was hardcoded 'labs' → now uses i18n key */}
              <Input
                id='g-unit'
                {...register('unit')}
                placeholder={t('goals.form.unitPlaceholder', 'e.g. labs')}
              />
            </div>
          </div>

          {/* Due date */}
          <div className='space-y-1.5'>
            <Label htmlFor='g-due'>
              {t('goals.form.dueDate')}{' '}
              <span className='text-muted-foreground'>
                ({t('goals.form.optional')})
              </span>
            </Label>
            <Input id='g-due' type='date' {...register('dueDate')} />
          </div>

          <div className='flex gap-2 pt-1'>
            <Button
              type='button'
              variant='outline'
              className='flex-1'
              onClick={close}>
              {t('goals.form.cancel')}
            </Button>
            <Button
              type='submit'
              className='flex-1 gap-2'
              disabled={!isValid || create.isPending}>
              {create.isPending && (
                <Loader2 size={14} className='animate-spin' />
              )}
              {t('goals.form.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
