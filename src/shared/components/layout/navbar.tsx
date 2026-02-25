import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Code, GraduationCap, Trophy, Crown, Star, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/shared/components/common/Logo';
import { ThemeToggle } from '@/shared/components/common/theme-toggle';
import { LanguageSwitcher } from '@/shared/components/common/language-switcher';
import { SearchButton, SearchDialog } from './search-dialog';
import { NavDropdown } from './nav-dropdown';
import { useAuthStore } from '@/core/store';
import { ROUTES } from '@/shared/constants';
import { useMySubscription } from '@/features/pricing/hooks/use-pricing';

// Plan badges
const PLAN_BADGES = {
  pro: {
    icon: Star,
    classes: 'bg-primary text-primary-foreground border-primary',
  },
  team: {
    icon: Crown,
    classes: 'bg-violet-500 text-white border-violet-500',
  },
  enterprise: {
    icon: Building2,
    classes: 'bg-cyan-500 text-white border-cyan-500',
  },
};

export function Navbar() {
  const { t } = useTranslation('common');
  const { isAuthenticated, user, logout } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch subscription if authenticated
  const { data: sub } = useMySubscription();
  
  // Resolve plan identifier and visual token
  const currentPlan = sub?.planId || 'free';
  const badgeToken = currentPlan !== 'free' ? PLAN_BADGES[currentPlan as keyof typeof PLAN_BADGES] : null;
  const BadgeIcon = badgeToken?.icon;

  const learningItems = [
    {
      label: t('navigation.labs'),
      href: ROUTES.COURSES.LIST,
      icon: <Code className='w-4 h-4' />,
      description: t('navigation.labsDesc'),
    },
    {
      label: t('navigation.paths'),
      href: '/paths',
      icon: <GraduationCap className='w-4 h-4' />,
      description: t('navigation.pathsDesc'),
      badge: 'Soon',
    },
    {
      label: t('navigation.challenges'),
      href: '/challenges',
      icon: <Trophy className='w-4 h-4' />,
      description: t('navigation.challengesDesc'),
      badge: 'Soon',
    },
  ];

  return (
    <>
      <nav className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center justify-between gap-4 mx-auto'>
          {/* Logo */}
          <Logo size='sm' />

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center gap-6 flex-1 justify-center'>
            <Link
              to={ROUTES.HOME}
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'>
              {t('navigation.home')}
            </Link>
            <NavDropdown
              label={t('navigation.learning')}
              items={learningItems}
            />
            <Link
              to={ROUTES.ABOUT}
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'>
              {t('navigation.about')}
            </Link>
            <Link
              to={ROUTES.PRICING}
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'>
              {t('navigation.pricing')}
            </Link>
          </div>

          {/* Right Section */}
          <div className='flex items-center gap-2'>
            {/* Search - Desktop only */}
            <div className='hidden lg:block'>
              <SearchButton onClick={() => setSearchOpen(true)} />
            </div>
            {isAuthenticated && <NotificationBell />}

            <LanguageSwitcher />
            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='rounded-full relative'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Subscription Badge Indicator */}
                    {BadgeIcon && (
                      <span 
                        className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background shadow-sm ${badgeToken?.classes}`}
                        title={`Plan: ${currentPlan.toUpperCase()}`}
                      >
                        <BadgeIcon className='h-2.5 w-2.5' />
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col space-y-1'>
                      <div className="flex items-center justify-between">
                        <p className='text-sm font-medium'>{user?.name}</p>
                        {/* Status tag in dropdown */}
                        {currentPlan !== 'free' && (
                           <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${badgeToken?.classes}`}>
                             {currentPlan}
                           </span>
                        )}
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.DASHBOARD.DashboardPage}>
                      {t('navigation.dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/profile`}>{t('navigation.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.DASHBOARD.DashboardPage}>
                      {t('navigation.settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    {t('navigation.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='hidden md:flex items-center gap-2'>
                <Button variant='ghost' size='sm' asChild>
                  <Link to={ROUTES.AUTH.LOGIN}>{t('navigation.login')}</Link>
                </Button>
                <Button size='sm' asChild>
                  <Link to={ROUTES.AUTH.REGISTER}>
                    {t('navigation.signUp')}
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className='lg:hidden'>
                <Button variant='ghost' size='icon'>
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-80'>
                <nav className='flex flex-col gap-4 mt-8'>
                  <Link
                    to={ROUTES.HOME}
                    onClick={() => setMobileMenuOpen(false)}
                    className='text-base font-medium hover:text-foreground transition-colors'>
                    {t('navigation.home')}
                  </Link>

                  <div className='space-y-2'>
                    <p className='text-sm font-semibold text-muted-foreground px-2'>
                      {t('navigation.learning')}
                    </p>
                    {learningItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className='flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors'>
                        {item.icon}
                        {item.label}
                        {item.badge && (
                          <span className='ml-auto text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded'>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>

                  <Link
                    to={ROUTES.ABOUT}
                    onClick={() => setMobileMenuOpen(false)}
                    className='text-base font-medium hover:text-foreground transition-colors'>
                    {t('navigation.about')}
                  </Link>
                  <Link
                    to={ROUTES.PRICING}
                    onClick={() => setMobileMenuOpen(false)}
                    className='text-base font-medium hover:text-foreground transition-colors'>
                    {t('navigation.pricing')}
                  </Link>

                  {!isAuthenticated && (
                    <div className='flex flex-col gap-2 pt-4 border-t'>
                      <Button asChild>
                        <Link to={ROUTES.AUTH.LOGIN}>
                          {t('navigation.login')}
                        </Link>
                      </Button>
                      <Button variant='outline' asChild>
                        <Link to={ROUTES.AUTH.REGISTER}>
                          {t('navigation.signUp')}
                        </Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

export default Navbar;
