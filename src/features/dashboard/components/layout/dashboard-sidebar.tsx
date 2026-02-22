import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  TrendingUp,
  Target,
  Users,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/shared/components/common/Logo';
import { ROUTES } from '@/shared/constants';
import useAuthStore from '@/features/auth/store/auth.store';

interface Props {
  onClose?: () => void;
}

const NAV = [
  {
    icon: LayoutDashboard,
    key: 'nav.overview',
    to: ROUTES.DASHBOARD.DashboardPage,
    end: true,
  },
  { icon: FlaskConical, key: 'nav.labs', to: ROUTES.DASHBOARD.LabsPage },
  { icon: TrendingUp, key: 'nav.progress', to: ROUTES.DASHBOARD.ProgressPage },
  { icon: Target, key: 'nav.goals', to: ROUTES.DASHBOARD.GoalsPage },
  { icon: Users, key: 'nav.community', to: ROUTES.DASHBOARD.CommunityPage },
];

export function DashboardSidebar({ onClose }: Props) {
  const { t } = useTranslation('dashboard');
  const { user, logout } = useAuthStore();

  return (
    <aside className='flex h-full w-60 flex-col border-r border-border/40 bg-background'>
      {/* Logo */}
      <div className='flex h-14 shrink-0 items-center border-b border-border/40 px-4'>
        <Logo />
      </div>

      {/* Nav links */}
      <nav className='flex-1 space-y-0.5 overflow-y-auto px-3 py-4'>
        {NAV.map(({ icon: Icon, key, to, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }>
            <Icon size={18} />
            {t(key)}
          </NavLink>
        ))}

        <div className='my-3 h-px bg-border/40' />

        <NavLink
          to={ROUTES.DASHBOARD.SettingsPage}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          }>
          <Settings size={18} />
          {t('nav.settings')}
        </NavLink>
      </nav>

      {/* User footer */}
      <div className='shrink-0 space-y-0.5 border-t border-border/40 p-3'>
        <NavLink
          to={ROUTES.PROFILE.VIEW}
          onClick={onClose}
          className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                     text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'>
          <User size={18} />
          <span className='truncate'>{user?.name ?? t('nav.profile')}</span>
        </NavLink>

        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive'
          onClick={() => logout()}>
          <LogOut size={18} />
          {t('nav.logout')}
        </Button>
      </div>
    </aside>
  );
}
