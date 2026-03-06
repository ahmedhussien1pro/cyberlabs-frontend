// src/features/settings/components/notifications-tab.tsx
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  useNotificationPrefs,
  useUpdateNotificationPrefs,
} from '../hooks/use-notification-prefs';
import type { NotificationPrefs } from '../types/settings.types';

interface ToggleRowProps {
  id: keyof NotificationPrefs;
  label: string;
  description: string;
  checked: boolean;
  onChange: (key: keyof NotificationPrefs, value: boolean) => void;
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: ToggleRowProps) {
  return (
    <div className='flex items-center justify-between rounded-xl border border-border/40 bg-card px-4 py-3'>
      <div className='space-y-0.5'>
        <Label htmlFor={id} className='cursor-pointer text-sm font-medium'>
          {label}
        </Label>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(id, v)}
      />
    </div>
  );
}

function GroupHeader({ label }: { label: string }) {
  return (
    <p className='px-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60'>
      {label}
    </p>
  );
}

export function NotificationsTab() {
  const { t } = useTranslation('settings');
  const { data: prefs, isLoading } = useNotificationPrefs();
  const { mutate } = useUpdateNotificationPrefs();

  const handleChange = (key: keyof NotificationPrefs, value: boolean) =>
    mutate({ [key]: value });

  const defaults: NotificationPrefs = {
    emailNotifications: true,
    pushNotifications: false,
    labCompleted: true,
    courseUpdates: true,
    achievementUnlocked: true,
    weeklyReport: false,
    monthlyDigest: false,
    securityAlerts: true,
    newCoursesAvailable: false,
    promotions: false,
  };
  const current = prefs ?? defaults;

  if (isLoading) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className='h-14 w-full rounded-xl' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-1'>
      {/* Email */}
      <GroupHeader label={t('notifications.groupEmail')} />
      <ToggleRow
        id='emailNotifications'
        label={t('notifications.email')}
        description={t('notifications.emailDesc')}
        checked={current.emailNotifications}
        onChange={handleChange}
      />
      <ToggleRow
        id='weeklyReport'
        label={t('notifications.weeklyReport')}
        description={t('notifications.weeklyReportDesc')}
        checked={current.weeklyReport}
        onChange={handleChange}
      />
      <ToggleRow
        id='monthlyDigest'
        label={t('notifications.monthlyDigest')}
        description={t('notifications.monthlyDigestDesc')}
        checked={current.monthlyDigest}
        onChange={handleChange}
      />
      <ToggleRow
        id='promotions'
        label={t('notifications.promotions')}
        description={t('notifications.promotionsDesc')}
        checked={current.promotions}
        onChange={handleChange}
      />

      {/* Push */}
      <GroupHeader label={t('notifications.groupPush')} />
      <ToggleRow
        id='pushNotifications'
        label={t('notifications.push')}
        description={t('notifications.pushDesc')}
        checked={current.pushNotifications}
        onChange={handleChange}
      />

      {/* Activity */}
      <GroupHeader label={t('notifications.groupActivity')} />
      <ToggleRow
        id='labCompleted'
        label={t('notifications.labCompleted')}
        description={t('notifications.labCompletedDesc')}
        checked={current.labCompleted}
        onChange={handleChange}
      />
      <ToggleRow
        id='courseUpdates'
        label={t('notifications.courseUpdates')}
        description={t('notifications.courseUpdatesDesc')}
        checked={current.courseUpdates}
        onChange={handleChange}
      />
      <ToggleRow
        id='achievementUnlocked'
        label={t('notifications.achievement')}
        description={t('notifications.achievementDesc')}
        checked={current.achievementUnlocked}
        onChange={handleChange}
      />
      <ToggleRow
        id='newCoursesAvailable'
        label={t('notifications.newCourses')}
        description={t('notifications.newCoursesDesc')}
        checked={current.newCoursesAvailable}
        onChange={handleChange}
      />
      <ToggleRow
        id='securityAlerts'
        label={t('notifications.security')}
        description={t('notifications.securityDesc')}
        checked={current.securityAlerts}
        onChange={handleChange}
      />
    </div>
  );
}
