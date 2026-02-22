import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User,
  Shield,
  Palette,
  Monitor,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccountTab } from '../components/account-tab';
import { SecurityTab } from '../components/security-tab';
import { AppearanceTab } from '../components/appearance-tab';
import { SessionsTab } from '../components/sessions-tab';
import { NotificationsTab } from '../components/notifications-tab';
import { DangerZoneTab } from '../components/danger-zone-tab';

const TABS = [
  { id: 'account', icon: User, key: 'tabs.account' },
  { id: 'security', icon: Shield, key: 'tabs.security' },
  { id: 'sessions', icon: Monitor, key: 'tabs.sessions' },
  { id: 'notifications', icon: Bell, key: 'tabs.notifications' },
  { id: 'appearance', icon: Palette, key: 'tabs.appearance' },
  { id: 'danger', icon: AlertTriangle, key: 'tabs.danger', danger: true },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function SettingsPage(): React.ReactElement {
  const { t } = useTranslation('settings');
  const [params, set] = useSearchParams();
  const active: TabId = (params.get('tab') as TabId) ?? 'account';

  return (
    <div className='container max-w-4xl py-6'>
      <div className='mb-6'>
        <h1 className='text-xl font-black tracking-tight'>{t('title')}</h1>
        <p className='text-sm text-muted-foreground'>{t('subtitle')}</p>
      </div>

      <div className='flex flex-col gap-6 md:flex-row'>
        {/* ── Tab list ──────────────────────────── */}
        <aside className='w-full shrink-0 md:w-48'>
          <nav className='space-y-0.5'>
            {TABS.map(({ id, icon: Icon, key, danger }) => (
              <button
                key={id}
                onClick={() => set({ tab: id }, { replace: true })}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active === id
                    ? danger
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-primary/10 text-primary'
                    : danger
                      ? 'text-muted-foreground hover:bg-destructive/5 hover:text-destructive'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}>
                <Icon size={15} />
                {t(key)}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Content ───────────────────────────── */}
        <div className='flex-1 rounded-xl border border-border/40 bg-card p-5'>
          {active === 'account' && <AccountTab />}
          {active === 'security' && <SecurityTab />}
          {active === 'sessions' && <SessionsTab />}
          {active === 'notifications' && <NotificationsTab />}
          {active === 'appearance' && <AppearanceTab />}
          {active === 'danger' && <DangerZoneTab />}
        </div>
      </div>
    </div>
  );
}
