// src/features/profile/components/profile-edit/edit-profile-form.tsx
import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import {
  Calendar, AlertTriangle, X,
  User, Phone, MapPin, Link2,
} from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
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

// ── Types ───────────────────────────────────────────────────────────────
const SOCIAL_PLATFORMS = [
  'GITHUB', 'LINKEDIN', 'TWITTER', 'YOUTUBE',
  'FACEBOOK', 'PORTFOLIO', 'EMAIL', 'OTHER',
] as const;

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
  bio: z.string().max(300).optional(),
  ar_bio: z.string().max(300).optional(),
  address: z.string().max(100).optional(),
  phoneNumber: z.string().max(20).optional(),
  birthday: z.string().optional(),
  socialLinks: z
    .array(z.object({
      type: z.enum(SOCIAL_PLATFORMS),
      url: z.string().url('Invalid URL'),
    }))
    .optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  profile: UserProfile;
  open: boolean;
  onClose: () => void;
}

// ── Helpers ─────────────────────────────────────────────────────────────

/**
 * Convert profile.birthday (ISO datetime or YYYY-MM-DD) to YYYY-MM-DD
 * so <input type="date"> renders the value correctly.
 */
function toDateInput(raw?: string | null): string {
  if (!raw) return '';
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  // ISO datetime → slice to YYYY-MM-DD
  return raw.slice(0, 10);
}

/**
 * Strip empty strings from optional fields before sending to API.
 * class-validator @IsOptional only skips null/undefined, NOT ''
 * so sending '' causes a 400 Bad Request.
 */
function sanitize(v: FormValues) {
  return {
    name: v.name,
    bio: v.bio || undefined,
    ar_bio: v.ar_bio || undefined,
    address: v.address || undefined,
    phoneNumber: v.phoneNumber || undefined,
    birthday: v.birthday || undefined, // '' → undefined — FIXES 400
    socialLinks: v.socialLinks,
  };
}

// ── Component ────────────────────────────────────────────────────────────
export function EditProfileForm({ profile, open, onClose }: Props) {
  const { t } = useTranslation('profile');
  const { mutate: save, isPending, error, reset: resetMutation } = useUpdateProfile();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const buildDefaults = () => ({
    name: profile.name,
    bio: profile.bio ?? '',
    ar_bio: profile.ar_bio ?? '',
    address: profile.address ?? '',
    phoneNumber: profile.phoneNumber ?? '',
    birthday: toDateInput(profile.birthday),
    socialLinks: (profile.socialLinks ?? []).map((l) => ({
      type: l.type as (typeof SOCIAL_PLATFORMS)[number],
      url: l.url,
    })),
  });

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(),
  });

  // Re-sync form when profile changes
  useEffect(() => {
    methods.reset(buildDefaults());
    resetMutation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // Track dirty state
  useEffect(() => {
    const sub = methods.watch(() =>
      setHasUnsavedChanges(methods.formState.isDirty),
    );
    return () => sub.unsubscribe();
  }, [methods]);

  const onSubmit = (values: FormValues) => {
    save(sanitize(values), {
      onSuccess: () => {
        setHasUnsavedChanges(false);
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (hasUnsavedChanges && !window.confirm(t('edit.unsavedWarning'))) return;
    methods.reset(buildDefaults());
    resetMutation();
    onClose();
  };

  // Watched values
  const nameLen    = methods.watch('name')?.length ?? 0;
  const bioLen     = methods.watch('bio')?.length ?? 0;
  const arBioLen   = methods.watch('ar_bio')?.length ?? 0;
  const birthdayVal = methods.watch('birthday');

  // Extract API error for inline display
  const apiErrorMsg = (() => {
    const e = error as Record<string, unknown> | null;
    const data = (e?.response as Record<string, unknown>)?.data as
      | Record<string, unknown>
      | undefined;
    const msg = data?.message;
    if (!msg) return null;
    return Array.isArray(msg) ? msg.join(' — ') : String(msg);
  })();

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent className='flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg'>
        <SheetHeader className='mb-4'>
          <SheetTitle>{t('editProfile')}</SheetTitle>
          <SheetDescription>{t('edit.desc')}</SheetDescription>
        </SheetHeader>

        {/* Unsaved changes warning */}
        {hasUnsavedChanges && (
          <Alert className='mb-3 border-yellow-500/20 bg-yellow-500/5'>
            <AlertTriangle className='h-4 w-4 text-yellow-500' />
            <AlertDescription className='text-xs text-yellow-600 dark:text-yellow-400'>
              {t('edit.unsavedChangesHint')}
            </AlertDescription>
          </Alert>
        )}

        {/* Inline API error */}
        {apiErrorMsg && (
          <Alert className='mb-3 border-destructive/20 bg-destructive/5'>
            <AlertTriangle className='h-4 w-4 text-destructive' />
            <AlertDescription className='text-xs text-destructive'>
              {apiErrorMsg}
            </AlertDescription>
          </Alert>
        )}

        {/* Avatar */}
        <div className='mb-4'>
          <EditAvatar name={profile.name} avatarUrl={profile.avatarUrl} />
        </div>

        <Separator className='mb-5' />

        <FormProvider {...methods}>
          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className='flex flex-1 flex-col gap-4'
            >
              {/* ──── Personal Info ──────────────────────────────── */}
              <SectionLabel
                icon={<User className='h-3.5 w-3.5' />}
                label={t('edit.sections.personal') ?? 'Personal Info'}
              />

              {/* Name */}
              <FormField
                control={methods.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        {t('edit.name')}
                      </FormLabel>
                      <span
                        className={`text-xs ${
                          nameLen > 44
                            ? 'text-amber-500'
                            : 'text-muted-foreground/50'
                        }`}
                      >
                        {nameLen}/50
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        autoComplete='username'
                        className='border-border/40 bg-background/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio EN */}
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
                          bioLen > 280 ? 'text-destructive' : 'text-muted-foreground/50'
                        }`}
                      >
                        {bioLen}/300
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className='resize-none border-border/40 bg-background/50'
                        placeholder='Tell the community about yourself…'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio AR */}
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
                          arBioLen > 280
                            ? 'text-destructive'
                            : 'text-muted-foreground/50'
                        }`}
                      >
                        {arBioLen}/300
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={3}
                        dir='rtl'
                        className='resize-none border-border/40 bg-background/50 text-right'
                        placeholder='أخبر المجتمع عن نفسك…'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ──── Contact ─────────────────────────────────────── */}
              <SectionLabel
                icon={<Phone className='h-3.5 w-3.5' />}
                label={t('edit.sections.contact') ?? 'Contact'}
              />

              <div className='grid grid-cols-2 gap-3'>
                {/* Address */}
                <FormField
                  control={methods.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        <MapPin className='h-3 w-3' />
                        {t('edit.address')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Cairo, EG'
                          className='border-border/40 bg-background/50'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
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
                          type='tel'
                          placeholder='+20 1XX XXX XXXX'
                          autoComplete='tel'
                          className='border-border/40 bg-background/50'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Birthday */}
              <FormField
                control={methods.control}
                name='birthday'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        <Calendar className='h-3.5 w-3.5' />
                        {t('edit.birthday')}
                      </FormLabel>
                      {/* Clear button — only visible when birthday is set */}
                      {birthdayVal && (
                        <button
                          type='button'
                          onClick={() =>
                            methods.setValue('birthday', '', { shouldDirty: true })
                          }
                          className='flex items-center gap-0.5 rounded text-[10px] text-muted-foreground transition-colors hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                          {t('edit.clearBirthday') ?? 'Clear'}
                        </button>
                      )}
                    </div>
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

              {/* ──── Social Links ──────────────────────────────────── */}
              <SectionLabel
                icon={<Link2 className='h-3.5 w-3.5' />}
                label={t('edit.sections.social') ?? 'Social Links'}
              />

              <EditSocialLinks />

              {/* ──── Actions ───────────────────────────────────────── */}
              <div className='mt-auto flex gap-3 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1 rounded-full border-border/40'
                  onClick={handleClose}
                >
                  {t('edit.cancel')}
                </Button>
                <Button
                  type='submit'
                  disabled={isPending || !hasUnsavedChanges}
                  className='flex-1 rounded-full shadow-sm shadow-primary/20'
                >
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

// ── Section label component ─────────────────────────────────────────────
function SectionLabel({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className='-mb-1 flex items-center gap-2'>
      <span className='text-muted-foreground'>{icon}</span>
      <span className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>
        {label}
      </span>
      <div className='h-px flex-1 bg-border/40' />
    </div>
  );
}
