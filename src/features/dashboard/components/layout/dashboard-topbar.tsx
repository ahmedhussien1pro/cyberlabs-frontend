// src/features/dashboard/components/layout/dashboard-topbar.tsx
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/shared/components/common/theme-toggle';
import { LanguageSwitcher } from '@/shared/components/common/language-switcher';
import { ROUTES } from '@/shared/constants';
import useAuthStore from '@/features/auth/store/auth.store';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { useProfile } from '@/features/profile/hooks/use-profile';
import { useSubscriptionBadge } from '@/features/pricing/hooks/use-pricing';
import { SubscriptionBadge } from '@/shared/components/common/subscription-badge';
import { cn } from '@/lib/utils';

interface Props {
  onMenuClick: () => void;
}

export function DashboardTopbar({ onMenuClick }: Props) {
  const { t } = useTranslation('dashboard');
  const { user, logout } = useAuthStore();
  const { data: profile } = useProfile();
  const { planId, isSubscribed } = useSubscriptionBadge();

  // ✅ Fix: use profile.avatarUrl not user.avatar
  const avatarUrl = profile?.avatarUrl;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CL';

  return (
    <header
      className='sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between
                 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md'>
      {/* Mobile hamburger */}
      <Button
        variant='ghost'
        size='icon'
        className='md:hidden'
        onClick={onMenuClick}
        aria-label='Open menu'>
        <Menu size={20} />
      </Button>

      <div className='hidden md:block' />

      {/* ── Right controls ───────────────────────── */}
      <div className='flex items-center gap-1'>
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationBell />

        {/* User dropdown with subscription crown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className={cn(
                'relative rounded-full h-auto w-auto px-1 pb-1',
                'focus-visible:ring-0 focus-visible:ring-offset-0 overflow-visible',
                isSubscribed ? 'pt-3' : 'pt-1',
              )}>
              {/* Crown badge on top */}
              {isSubscribed && (
                <SubscriptionBadge
                  planId={planId}
                  variant='crown'
                  className='absolute top-0 left-1/2 -translate-x-1/2'
                />
              )}
              <Avatar className='h-8 w-8'>
                <AvatarImage
                  src={avatarUrl}
                  alt={user?.name}
                  className='object-cover'
                />
                <AvatarFallback className='bg-primary/10 text-xs font-bold text-primary'>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-56'>
            <div className='px-3 py-2.5'>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-semibold truncate'>{user?.name}</p>
                {isSubscribed && (
                  <SubscriptionBadge planId={planId} variant='pill' />
                )}
              </div>
              <p className='truncate text-xs text-muted-foreground mt-0.5'>
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={ROUTES.PROFILE.VIEW}>{t('nav.profile')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTES.DASHBOARD.SettingsPage}>
                {t('nav.settings')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive focus:text-destructive focus:bg-destructive/10'
              onClick={() => logout()}>
              {t('nav.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
