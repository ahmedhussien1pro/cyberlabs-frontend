import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/authStore';

export const MobileMenu = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: isAuthenticated ? '/dashboard' : '/', label: t('nav.learning') },
    { to: '/about', label: t('nav.about') },
    { to: '/paths', label: t('nav.paths') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className='lg:hidden'>
        <Button variant='ghost' size='icon'>
          {open ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-[300px] sm:w-[400px]'>
        <nav className='flex flex-col gap-4 mt-8'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
