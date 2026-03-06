import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Plus, X, Github, Linkedin, Twitter, Youtube, Facebook, Globe, Mail, ExternalLink } from 'lucide-react';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const PLATFORMS = [
  { value: 'GITHUB', label: 'GitHub', icon: Github, pattern: /^https:\/\/(www\.)?github\.com\// },
  { value: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin, pattern: /^https:\/\/(www\.)?linkedin\.com\/in\// },
  { value: 'TWITTER', label: 'Twitter', icon: Twitter, pattern: /^https:\/\/(www\.)?(twitter|x)\.com\// },
  { value: 'YOUTUBE', label: 'YouTube', icon: Youtube, pattern: /^https:\/\/(www\.)?youtube\.com\// },
  { value: 'FACEBOOK', label: 'Facebook', icon: Facebook, pattern: /^https:\/\/(www\.)?facebook\.com\// },
  { value: 'PORTFOLIO', label: 'Portfolio', icon: Globe, pattern: /^https?:\/\// },
  { value: 'EMAIL', label: 'Email', icon: Mail, pattern: /^mailto:/ },
  { value: 'OTHER', label: 'Other', icon: ExternalLink, pattern: /^https?:\/\// },
] as const;

export function EditSocialLinks() {
  const { t } = useTranslation('profile');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  const addLink = () => {
    append({ type: 'GITHUB', url: '' });
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          {t('edit.socialLinks')}
        </FormLabel>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={addLink}
          className='h-7 gap-1.5 rounded-full text-xs'>
          <Plus className='h-3.5 w-3.5' />
          {t('edit.addLink')}
        </Button>
      </div>

      {fields.length === 0 && (
        <p className='rounded-xl border border-dashed border-border/50 bg-muted/20 px-4 py-6 text-center text-xs text-muted-foreground'>
          {t('edit.noSocialLinks')}
        </p>
      )}

      <div className='space-y-2'>
        {fields.map((field, index) => {
          const platformData = PLATFORMS.find(
            (p) => p.value === (field as any).type,
          );
          const Icon = platformData?.icon ?? ExternalLink;

          return (
            <div
              key={field.id}
              className='flex items-start gap-2 rounded-xl border border-border/40 bg-muted/30 p-3'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/80'>
                <Icon className='h-4 w-4 text-muted-foreground' />
              </div>

              <div className='flex-1 space-y-2'>
                <FormField
                  control={control}
                  name={`socialLinks.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PLATFORMS.map((p) => {
                            const PIcon = p.icon;
                            return (
                              <SelectItem
                                key={p.value}
                                value={p.value}
                                className='text-xs'>
                                <div className='flex items-center gap-2'>
                                  <PIcon className='h-3.5 w-3.5' />
                                  {p.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`socialLinks.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={`https://${platformData?.label.toLowerCase()}.com/username`}
                          className='h-8 text-xs'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => remove(index)}
                className='h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive'>
                <X className='h-4 w-4' />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
