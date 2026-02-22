import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Shield, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccountTab } from '../components/account-tab';
import { SecurityTab } from '../components/security-tab';
import { AppearanceTab } from '../components/appearance-tab';

const TABS = [
  { id: 'account', icon: User, key: 'tabs.account' },
  { id: 'security', icon: Shield, key: 'tabs.security' },
  { id: 'appearance', icon: Palette, key: 'tabs.appearance' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function SettingsPage(): React.ReactElement {
  const { t } = useTranslation('settings');
  const [params, setParams] = useSearchParams();
  const active: TabId = (params.get('tab') as TabId) ?? 'account';

  const setTab = (id: TabId) => setParams({ tab: id }, { replace: true });

  return (
    <div className='container max-w-4xl py-6'>
      <div className='mb-6'>
        <h1 className='text-xl font-black tracking-tight text-foreground'>
          {t('title')}
        </h1>
        <p className='text-sm text-muted-foreground'>{t('subtitle')}</p>
      </div>

      <div className='flex flex-col gap-6 md:flex-row'>
        {/* ── Vertical tab list ─────────────────── */}
        <aside className='w-full shrink-0 md:w-44'>
          <nav className='space-y-0.5'>
            {TABS.map(({ id, icon: Icon, key }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active === id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}>
                <Icon size={16} />
                {t(key)}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Tab content ───────────────────────── */}
        <div className='flex-1 rounded-xl border border-border/40 bg-card p-5'>
          {active === 'account' && <AccountTab />}
          {active === 'security' && <SecurityTab />}
          {active === 'appearance' && <AppearanceTab />}
        </div>
      </div>
    </div>
  );
}
