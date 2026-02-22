import { Menu, Bell } from 'lucide-react';
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

interface Props {
  onMenuClick: () => void;
}

export function DashboardTopbar({ onMenuClick }: Props) {
  const { t } = useTranslation('dashboard');
  const { user, logout } = useAuthStore();

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

      {/* Desktop spacer */}
      <div className='hidden md:block' />

      {/* Right controls */}
      <div className='flex items-center gap-1'>
        <LanguageSwitcher />
        <ThemeToggle />

        <Button variant='ghost' size='icon' className='text-muted-foreground'>
          <Bell size={18} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='rounded-full'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className='bg-primary/10 text-xs font-bold text-primary'>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-48'>
            <div className='px-2 py-1.5'>
              <p className='text-sm font-semibold'>{user?.name}</p>
              <p className='truncate text-xs text-muted-foreground'>
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
              className='text-destructive focus:text-destructive'
              onClick={() => logout()}>
              {t('nav.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
