import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const PLATFORMS = [
  'GITHUB',
  'LINKEDIN',
  'TWITTER',
  'YOUTUBE',
  'FACEBOOK',
  'PORTFOLIO',
  'EMAIL',
  'OTHER',
];

export function EditSocialLinks() {
  const { t } = useTranslation('profile');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-semibold text-foreground'>
          {t('edit.socialLinks')}
        </p>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => append({ type: 'GITHUB', url: '' })}
          className='h-7 gap-1 rounded-full border-border/40 px-2.5 text-xs hover:border-primary/40'>
          <Plus className='h-3.5 w-3.5' /> {t('edit.addLink')}
        </Button>
      </div>

      {fields.map((field, i) => (
        <div key={field.id} className='flex gap-2'>
          <FormField
            control={control}
            name={`socialLinks.${i}.type`}
            render={({ field }) => (
              <FormItem className='w-36 flex-shrink-0'>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='h-9 border-border/40 bg-background/50 text-xs'>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p} className='text-xs'>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`socialLinks.${i}.url`}
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormControl>
                  <Input
                    placeholder='https://...'
                    className='h-9 border-border/40 bg-background/50 text-xs'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => remove(i)}
            className='h-9 w-9 flex-shrink-0 text-destructive hover:bg-destructive/10'>
            <Trash2 className='h-3.5 w-3.5' />
          </Button>
        </div>
      ))}
    </div>
  );
}
