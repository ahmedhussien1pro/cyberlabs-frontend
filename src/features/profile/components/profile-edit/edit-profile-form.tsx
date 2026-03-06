import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Calendar, AlertTriangle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { UserProfile } from '../../types/profile.types';
import { useUpdateProfile } from '../../hooks/use-update-profile';
import { EditAvatar } from './edit-avatar';
import { EditSocialLinks } from './edit-social-links';

const SOCIAL_PLATFORMS = [
  'GITHUB',
  'LINKEDIN',
  'TWITTER',
  'YOUTUBE',
  'FACEBOOK',
  'PORTFOLIO',
  'EMAIL',
  'OTHER',
] as const;

const schema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(300).optional(),
  ar_bio: z.string().max(300).optional(),
  address: z.string().max(100).optional(),
  phoneNumber: z.string().max(20).optional(),
  birthday: z.string().optional(),
  socialLinks: z
    .array(
      z.object({
        type: z.enum(SOCIAL_PLATFORMS),
        url: z.string().url('Invalid URL'),
      }),
    )
    .optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  profile: UserProfile;
  open: boolean;
  onClose: () => void;
}

export function EditProfileForm({ profile, open, onClose }: Props) {
  const { t } = useTranslation('profile');
  const { mutate: save, isPending } = useUpdateProfile();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name,
      bio: profile.bio ?? '',
      ar_bio: profile.ar_bio ?? '',
      address: profile.address ?? '',
      phoneNumber: profile.phoneNumber ?? '',
      birthday: profile.birthday ?? '',
      socialLinks: (profile.socialLinks ?? []).map((l) => ({
        type: l.type as (typeof SOCIAL_PLATFORMS)[number],
        url: l.url,
      })),
    },
  });

  useEffect(() => {
    methods.reset({
      name: profile.name,
      bio: profile.bio ?? '',
      ar_bio: profile.ar_bio ?? '',
      address: profile.address ?? '',
      phoneNumber: profile.phoneNumber ?? '',
      birthday: profile.birthday ?? '',
      socialLinks: (profile.socialLinks ?? []).map((l) => ({
        type: l.type as (typeof SOCIAL_PLATFORMS)[number],
        url: l.url,
      })),
    });
  }, [profile, methods]);

  useEffect(() => {
    const subscription = methods.watch(() => {
      setHasUnsavedChanges(methods.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const onSubmit = (values: FormValues) => {
    save(values, {
      onSuccess: () => {
        setHasUnsavedChanges(false);
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm(t('edit.unsavedWarning'));
      if (!confirm) return;
    }
    onClose();
  };

  const bioValue = methods.watch('bio') ?? '';
  const arBioValue = methods.watch('ar_bio') ?? '';
  // const isAr = i18n.language === 'ar';

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent className='flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg'>
        <SheetHeader className='mb-4'>
          <SheetTitle>{t('editProfile')}</SheetTitle>
          <SheetDescription>{t('edit.desc')}</SheetDescription>
        </SheetHeader>

        {hasUnsavedChanges && (
          <Alert className='mb-3 border-yellow-500/20 bg-yellow-500/5'>
            <AlertTriangle className='h-4 w-4 text-yellow-600' />
            <AlertDescription className='text-xs text-yellow-700 dark:text-yellow-400'>
              {t('edit.unsavedChangesHint')}
            </AlertDescription>
          </Alert>
        )}

        <div className='mb-4'>
          <EditAvatar name={profile.name} avatarUrl={profile.avatarUrl} />
        </div>

        <Separator className='mb-5' />

        <FormProvider {...methods}>
          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className='flex flex-1 flex-col gap-4'>
              <FormField
                control={methods.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                      {t('edit.name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='border-border/40 bg-background/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        {t('edit.bio')} (EN)
                      </FormLabel>
                      <span
                        className={`text-xs ${
                          bioValue.length > 300
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        }`}>
                        {bioValue.length}/300
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className='resize-none border-border/40 bg-background/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name='ar_bio'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        {t('edit.bio')} (AR)
                      </FormLabel>
                      <span
                        className={`text-xs ${
                          arBioValue.length > 300
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        }`}>
                        {arBioValue.length}/300
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={3}
                        dir='rtl'
                        className='resize-none border-border/40 bg-background/50 text-right'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-3'>
                <FormField
                  control={methods.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        {t('edit.address')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='border-border/40 bg-background/50'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        {t('edit.phoneNumber')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='border-border/40 bg-background/50'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={methods.control}
                name='birthday'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                      <Calendar className='h-3.5 w-3.5' />
                      {t('edit.birthday')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        className='border-border/40 bg-background/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />
              <EditSocialLinks />

              <div className='mt-auto flex gap-3 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1 rounded-full border-border/40'
                  onClick={handleClose}>
                  {t('edit.cancel')}
                </Button>
                <Button
                  type='submit'
                  disabled={isPending || !hasUnsavedChanges}
                  className='flex-1 rounded-full shadow-sm shadow-primary/20'>
                  {isPending ? (
                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                  ) : (
                    t('edit.save')
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
