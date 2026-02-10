import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Trophy,
  User,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const Sidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      end: true,
    },
    {
      to: '/courses',
      icon: BookOpen,
      label: 'Courses',
    },
    {
      to: '/labs',
      icon: FlaskConical,
      label: 'Labs',
    },
    {
      to: '/leaderboard',
      icon: Trophy,
      label: 'Leaderboard',
    },
    {
      to: '/dashboard/profile',
      icon: User,
      label: 'Profile',
    },
    {
      to: '/dashboard/settings',
      icon: Settings,
      label: 'Settings',
    },
  ];

  return (
    <aside className='hidden lg:flex w-64 flex-col border-r bg-card'>
      <nav className='flex-1 space-y-1 p-4'>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }>
            <item.icon className='h-5 w-5' />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
