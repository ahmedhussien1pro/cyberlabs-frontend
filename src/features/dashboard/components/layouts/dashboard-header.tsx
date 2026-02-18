// src/features/dashboard/components/layout/dashboard-header.tsx

import { Menu, Bell, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDashboardStore } from '../../store/dashboard.store';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function DashboardHeader() {
  const { t } = useTranslation(['dashboard']);
  const { toggleSidebar } = useDashboardStore();
  const { user, logout } = useAuthStore();

  const userInitials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <header className='sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6'>
      {/* Mobile Menu Toggle */}
      <Button
        variant='ghost'
        size='icon'
        className='lg:hidden'
        onClick={toggleSidebar}>
        <Menu className='h-5 w-5' />
      </Button>

      {/* Search */}
      <div className='flex-1'>
        <Button
          variant='outline'
          className='w-full max-w-md justify-start gap-2 text-muted-foreground'>
          <Search className='h-4 w-4' />
          <span className='hidden md:inline'>{t('header.search')}</span>
          <kbd className='pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
            <span className='text-xs'>⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-2'>
        {/* Notifications */}
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          <span className='absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500' />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-9 w-9 rounded-full'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('header.profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('header.settings')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              {t('header.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
