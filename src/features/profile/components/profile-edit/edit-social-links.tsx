import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  X,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Facebook,
  Globe,
  Mail,
  ExternalLink,
} from 'lucide-react';
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
  { value: 'GITHUB',    label: 'GitHub',    icon: Github,       placeholder: 'https://github.com/username' },
  { value: 'LINKEDIN',  label: 'LinkedIn',  icon: Linkedin,     placeholder: 'https://linkedin.com/in/username' },
  { value: 'TWITTER',   label: 'Twitter',   icon: Twitter,      placeholder: 'https://x.com/username' },
  { value: 'YOUTUBE',   label: 'YouTube',   icon: Youtube,      placeholder: 'https://youtube.com/channel' },
  { value: 'FACEBOOK',  label: 'Facebook',  icon: Facebook,     placeholder: 'https://facebook.com/username' },
  { value: 'PORTFOLIO', label: 'Portfolio', icon: Globe,        placeholder: 'https://myportfolio.com' },
  { value: 'EMAIL',     label: 'Email',     icon: Mail,         placeholder: 'mailto:you@example.com' },
  { value: 'OTHER',     label: 'Other',     icon: ExternalLink, placeholder: 'https://' },
] as const;

export function EditSocialLinks() {
  const { t } = useTranslation('profile');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  return (
    <div className='space-y-3'>
      {/* ── Section header — plain <label> NOT <FormLabel> ─── */}
      <div className='flex items-center justify-between'>
        <label className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          {t('edit.socialLinks')}
        </label>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => append({ type: 'GITHUB', url: '' })}
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
              {/* Platform icon badge */}
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/80'>
                <Icon className='h-4 w-4 text-muted-foreground' />
              </div>

              <div className='flex-1 space-y-2'>
                {/* Platform selector */}
                <FormField
                  control={control}
                  name={`socialLinks.${index}.type`}
                  render={({ field: f }) => (
                    <FormItem>
                      <Select
                        onValueChange={f.onChange}
                        defaultValue={f.value}>
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

                {/* URL input */}
                <FormField
                  control={control}
                  name={`socialLinks.${index}.url`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={
                            platformData?.placeholder ?? 'https://'
                          }
                          className='h-8 text-xs'
                          {...f}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Remove button */}
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
