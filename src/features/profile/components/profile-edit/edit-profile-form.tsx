import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
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
  address: z.string().max(100).optional(),
  phoneNumber: z.string().max(20).optional(),
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

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name,
      bio: profile.bio ?? '',
      address: profile.address ?? '',
      phoneNumber: profile.phoneNumber ?? '',
      socialLinks: profile.socialLinks.map((l) => ({
        type: l.type as (typeof SOCIAL_PLATFORMS)[number],
        url: l.url,
      })),
    },
  });

  useEffect(() => {
    methods.reset({
      name: profile.name,
      bio: profile.bio ?? '',
      address: profile.address ?? '',
      phoneNumber: profile.phoneNumber ?? '',
      socialLinks: profile.socialLinks.map((l) => ({
        type: l.type as (typeof SOCIAL_PLATFORMS)[number],
        url: l.url,
      })),
    });
  }, [profile, methods]);

  const onSubmit = (values: FormValues) => {
    save(values, { onSuccess: onClose });
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className='flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg'>
        <SheetHeader className='mb-4'>
          <SheetTitle>{t('editProfile')}</SheetTitle>
          <SheetDescription>{t('edit.desc')}</SheetDescription>
        </SheetHeader>

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
                    <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                      {t('edit.bio')}
                    </FormLabel>
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

              <div className='grid grid-cols-2 gap-3'>
                {(['address', 'phoneNumber'] as const).map((name) => (
                  <FormField
                    key={name}
                    control={methods.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                          {t(`edit.${name}`)}
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
                ))}
              </div>

              <Separator />
              <EditSocialLinks />

              <div className='mt-auto flex gap-3 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1 rounded-full border-border/40'
                  onClick={onClose}>
                  {t('edit.cancel')}
                </Button>
                <Button
                  type='submit'
                  disabled={isPending}
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
