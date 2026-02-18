// src/features/dashboard/components/layout/dashboard-sidebar.tsx

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDashboardStore } from '../../store/dashboard.store';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'labs', path: '/dashboard/labs' },
  { icon: Target, label: 'goals', path: '/dashboard/goals' },
  { icon: TrendingUp, label: 'progress', path: '/dashboard/progress' },
  { icon: Users, label: 'community', path: '/dashboard/community' },
  { icon: Settings, label: 'settings', path: '/dashboard/settings' },
];

export function DashboardSidebar() {
  const { t } = useTranslation(['dashboard']);
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen } =
    useDashboardStore();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 lg:relative',
          sidebarCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}>
        {/* Logo */}
        <div className='flex h-16 items-center justify-between border-b px-4'>
          {!sidebarCollapsed && (
            <Link to='/dashboard' className='text-xl font-bold'>
              CyberLabs
            </Link>
          )}
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className='hidden lg:flex'>
            {sidebarCollapsed ? (
              <ChevronRight className='h-4 w-4' />
            ) : (
              <ChevronLeft className='h-4 w-4' />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 space-y-1 p-2'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                title={sidebarCollapsed ? t(`nav.${item.label}`) : undefined}>
                <Icon className='h-5 w-5 flex-shrink-0' />
                {!sidebarCollapsed && <span>{t(`nav.${item.label}`)}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
