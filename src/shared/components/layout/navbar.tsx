// src/shared/components/layout/navbar.tsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  Code,
  GraduationCap,
  Trophy,
  LayoutDashboard,
  Info,
  Mail,
  ShieldAlert,
  FileText,
  Search,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { useSubscriptionBadge } from '@/features/pricing/hooks/use-pricing';
import { SubscriptionBadge } from '@/shared/components/common/subscription-badge';

export function Navbar() {
  const { t, i18n } = useTranslation('common');
  const { isAuthenticated, user, logout } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { planId, isSubscribed } = useSubscriptionBadge();

  const userAvatar = user?.avatarUrl;
  const isRTL = i18n.dir() === 'rtl';

  const learningItems = useMemo(
    () => [
      {
        label: t('navigation.paths', 'Career Paths'),
        href: ROUTES.PATHS.LIST,
        icon: <LayoutDashboard className='w-4 h-4' />,
        description: t(
          'navigation.pathsDesc',
          'Guided roadmaps for your career',
        ),
      },
      {
        label: t('navigation.courses', 'Courses'),
        href: ROUTES.COURSES.LIST,
        icon: <GraduationCap className='w-4 h-4' />,
        description: t(
          'navigation.coursesDesc',
          'Learn cybersecurity fundamentals',
        ),
      },
      {
        label: t('navigation.labs', 'Labs'),
        href: ROUTES.LABS.LIST,
        icon: <Code className='w-4 h-4' />,
        description: t(
          'navigation.labsDesc',
          'Practice in real-world environments',
        ),
      },
      {
        label: t('navigation.challenges', 'CTF Challenges'),
        href: ROUTES.CHALLENGES.LIST,
        icon: <Trophy className='w-4 h-4' />,
        description: t(
          'navigation.challengesDesc',
          'Compete and test your skills',
        ),
        badge: t('navigation.soon', 'Soon'),
      },
    ],
    [t],
  );

  const companyItems = useMemo(
    () => [
      {
        label: t('navigation.about', 'About Us'),
        href: ROUTES.ABOUT,
        icon: <Info className='w-4 h-4' />,
        description: t(
          'navigation.aboutDesc',
          'Learn about our mission and team',
        ),
      },
      {
        label: t('navigation.contact', 'Contact'),
        href: ROUTES.CONTACT,
        icon: <Mail className='w-4 h-4' />,
        description: t('navigation.contactDesc', 'Get in touch with support'),
      },
      {
        label: t('navigation.privacy', 'Privacy Policy'),
        href: ROUTES.PRIVACY,
        icon: <ShieldAlert className='w-4 h-4' />,
        description: t('navigation.privacyDesc', 'How we protect your data'),
      },
      {
        label: t('navigation.terms', 'Terms of Service'),
        href: ROUTES.TERMS,
        icon: <FileText className='w-4 h-4' />,
        description: t(
          'navigation.termsDesc',
          'Rules and guidelines for usage',
        ),
      },
    ],
    [t],
  );

  return (
    <>
      <nav className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center justify-between gap-4 mx-auto'>
          <Logo size='sm' />

          {/* Desktop nav */}
          <div className='hidden lg:flex items-center gap-6 flex-1 justify-center'>
            <Link
              to={ROUTES.HOME}
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'>
              {t('navigation.home', 'Home')}
            </Link>
            <NavDropdown
              label={t('navigation.learning', 'Learning')}
              items={learningItems}
            />
            <NavDropdown
              label={t('navigation.company', 'Company')}
              items={companyItems}
            />
            <Link
              to={ROUTES.PRICING}
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'>
              {t('navigation.pricing', 'Pricing')}
            </Link>
          </div>

          {/* Right section */}
          <div className='flex items-center gap-2'>
            <div className='hidden lg:block'>
              <SearchButton onClick={() => setSearchOpen(true)} />
            </div>
            {isAuthenticated && <NotificationBell />}
            <LanguageSwitcher />
            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className={cn(
                      'relative rounded-full h-auto w-auto px-1 pb-1',
                      'focus-visible:ring-0 focus-visible:ring-offset-0',
                      'overflow-visible',
                      isSubscribed ? 'pt-3' : 'pt-1',
                    )}>
                    {isSubscribed && (
                      <SubscriptionBadge
                        planId={planId}
                        variant='crown'
                        className='absolute top-0 left-1/2 -translate-x-1/2'
                      />
                    )}
                    <Avatar className='h-9 w-9 overflow-hidden'>
                      <AvatarImage
                        src={userAvatar}
                        alt={user?.name}
                        className='object-cover scale-[1.3]'
                      />
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end' className='w-60'>
                  <DropdownMenuLabel className='py-2.5 px-3'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-semibold truncate'>
                          {user?.name}
                        </span>
                        {isSubscribed && (
                          <SubscriptionBadge planId={planId} variant='pill' />
                        )}
                      </div>
                      <span className='text-xs text-muted-foreground font-normal'>
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.DASHBOARD.DashboardPage}>
                      {t('navigation.dashboard', 'Dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.PROFILE.VIEW}>
                      {t('navigation.profile', 'Profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.DASHBOARD.SettingsPage}>
                      {t('navigation.settings', 'Settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className='text-destructive focus:text-destructive focus:bg-destructive/10'>
                    {t('navigation.logout', 'Log Out')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='hidden md:flex items-center gap-2'>
                <Button variant='ghost' size='sm' asChild>
                  <Link to={ROUTES.AUTH.LOGIN}>
                    {t('navigation.login', 'Log In')}
                  </Link>
                </Button>
                <Button size='sm' asChild>
                  <Link to={ROUTES.AUTH.REGISTER}>
                    {t('navigation.signUp', 'Sign Up')}
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile menu — RTL-aware side */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className='lg:hidden'>
                <Button variant='ghost' size='icon'>
                  <Menu className='h-5 w-5' />
                  {/* ✅ Fix: sr-only مترجم */}
                  <span className='sr-only'>
                    {t('navigation.toggleMenu', 'Toggle menu')}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRTL ? 'left' : 'right'}
                className='w-80 overflow-y-auto'>
                <nav className='flex flex-col gap-4 mt-8'>
                  {/* ✅ Fix: Mobile Search */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    className='flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-muted/50 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full text-start'>
                    <Search className='w-4 h-4 shrink-0' />
                    {t('search.button', 'Search anything...')}
                  </button>

                  <Link
                    to={ROUTES.HOME}
                    onClick={() => setMobileMenuOpen(false)}
                    className='text-base font-medium hover:text-foreground transition-colors'>
                    {t('navigation.home', 'Home')}
                  </Link>

                  <div className='space-y-2'>
                    <p className='text-sm font-semibold text-muted-foreground px-2'>
                      {t('navigation.learning', 'Learning')}
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
                          <span className='ms-auto text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded'>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>

                  <div className='space-y-2'>
                    <p className='text-sm font-semibold text-muted-foreground px-2 pt-2 border-t'>
                      {t('navigation.company', 'Company')}
                    </p>
                    {companyItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className='flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors'>
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <Link
                    to={ROUTES.PRICING}
                    onClick={() => setMobileMenuOpen(false)}
                    className='text-base font-medium hover:text-foreground transition-colors pt-2 border-t'>
                    {t('navigation.pricing', 'Pricing')}
                  </Link>

                  {/* ✅ Fix: Auth actions في mobile */}
                  {isAuthenticated ? (
                    <div className='flex flex-col gap-1 pt-4 border-t'>
                      <div className='flex items-center gap-3 px-2 py-2 mb-1'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage
                            src={userAvatar}
                            alt={user?.name}
                            className='object-cover scale-[1.3]'
                          />
                          <AvatarFallback>
                            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col min-w-0'>
                          <span className='text-sm font-medium truncate'>
                            {user?.name}
                          </span>
                          <span className='text-xs text-muted-foreground truncate'>
                            {user?.email}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={ROUTES.DASHBOARD.DashboardPage}
                        onClick={() => setMobileMenuOpen(false)}
                        className='flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors'>
                        <LayoutDashboard className='w-4 h-4' />
                        {t('navigation.dashboard', 'Dashboard')}
                      </Link>
                      <Link
                        to={ROUTES.PROFILE.VIEW}
                        onClick={() => setMobileMenuOpen(false)}
                        className='flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors'>
                        <User className='w-4 h-4' />
                        {t('navigation.profile', 'Profile')}
                      </Link>
                      <Link
                        to={ROUTES.DASHBOARD.SettingsPage}
                        onClick={() => setMobileMenuOpen(false)}
                        className='flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors'>
                        <Settings className='w-4 h-4' />
                        {t('navigation.settings', 'Settings')}
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        className='flex items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors w-full text-start'>
                        <LogOut className='w-4 h-4' />
                        {t('navigation.logout', 'Log Out')}
                      </button>
                    </div>
                  ) : (
                    <div className='flex flex-col gap-2 pt-4 border-t'>
                      <Button asChild>
                        <Link to={ROUTES.AUTH.LOGIN}>
                          {t('navigation.login', 'Log In')}
                        </Link>
                      </Button>
                      <Button variant='outline' asChild>
                        <Link to={ROUTES.AUTH.REGISTER}>
                          {t('navigation.signUp', 'Sign Up')}
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

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

export default Navbar;
