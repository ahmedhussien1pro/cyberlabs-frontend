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
    <div className='flex items-center justify-between rounded-xl border border-border/40 bg-card p-4'>
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

export function NotificationsTab() {
  const { t } = useTranslation('settings');
  const { data: prefs, isLoading } = useNotificationPrefs();
  const { mutate } = useUpdateNotificationPrefs();

  const handleChange = (key: keyof NotificationPrefs, value: boolean) => {
    mutate({ [key]: value });
  };

  const ITEMS: Array<{
    id: keyof NotificationPrefs;
    label: string;
    desc: string;
  }> = [
    {
      id: 'emailNotifications',
      label: t('notifications.email'),
      desc: t('notifications.emailDesc'),
    },
    {
      id: 'labCompleted',
      label: t('notifications.labCompleted'),
      desc: t('notifications.labCompletedDesc'),
    },
    {
      id: 'courseUpdates',
      label: t('notifications.courseUpdates'),
      desc: t('notifications.courseUpdatesDesc'),
    },
    {
      id: 'achievementUnlocked',
      label: t('notifications.achievement'),
      desc: t('notifications.achievementDesc'),
    },
    {
      id: 'weeklyReport',
      label: t('notifications.weeklyReport'),
      desc: t('notifications.weeklyReportDesc'),
    },
    {
      id: 'securityAlerts',
      label: t('notifications.security'),
      desc: t('notifications.securityDesc'),
    },
  ];

  if (isLoading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-16 w-full rounded-xl' />
        ))}
      </div>
    );
  }

  const defaults: NotificationPrefs = {
    emailNotifications: true,
    pushNotifications: false,
    labCompleted: true,
    courseUpdates: true,
    achievementUnlocked: true,
    weeklyReport: false,
    securityAlerts: true,
  };
  const current = prefs ?? defaults;

  return (
    <div className='space-y-3'>
      {ITEMS.map((item) => (
        <ToggleRow
          key={item.id}
          id={item.id}
          label={item.label}
          description={item.desc}
          checked={current[item.id]}
          onChange={handleChange}
        />
      ))}
    </div>
  );
}
