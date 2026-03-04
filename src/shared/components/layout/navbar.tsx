// src/shared/components/layout/navbar.tsx
import { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '../../../features/profile/hooks/use-profile';
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
  const { t } = useTranslation('common');
  const { isAuthenticated, user, logout } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { planId, isSubscribed } = useSubscriptionBadge();
  const { data: profile } = useProfile();
  const userAvatar = profile?.avatarUrl;

  const learningItems = [
    {
      label: t('navigation.courses', 'Courses'),
      href: '/courses',
      icon: <GraduationCap className='w-4 h-4' />,
      description: t(
        'navigation.coursesDesc',
        'Learn cybersecurity fundamentals',
      ),
    },
    {
      label: t('navigation.labs', 'Labs'),
      href: '/labs',
      icon: <Code className='w-4 h-4' />,
      description: t(
        'navigation.labsDesc',
        'Practice in real-world environments',
      ),
    },
    {
      label: t('navigation.paths', 'Career Paths'),
      href: '/paths',
      icon: <LayoutDashboard className='w-4 h-4' />,
      description: t('navigation.pathsDesc', 'Guided roadmaps for your career'),
    },
    {
      label: t('navigation.challenges', 'CTF Challenges'),
      href: '/challenges',
      icon: <Trophy className='w-4 h-4' />,
      description: t(
        'navigation.challengesDesc',
        'Compete and test your skills',
      ),
      badge: 'Soon',
    },
  ];

  const companyItems = [
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
      description: t('navigation.termsDesc', 'Rules and guidelines for usage'),
    },
  ];

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
              {t('navigation.home')}
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
              {t('navigation.pricing')}
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
                  {/*
                   * ── المبدأ ────────────────────────────────────────────
                   * لما في تاج: pt-3 يعمل مساحة فوق الـ avatar.
                   * التاج في top-0 داخل هذه المساحة.
                   * الـ button نفسه overflow-visible عشان التاج ما يتقطعش.
                   * النتيجة: avatar لابس تاج فوق رأسه مباشرةً.
                   */}
                  <Button
                    variant='ghost'
                    className={cn(
                      'relative rounded-full h-auto w-auto px-1 pb-1',
                      'focus-visible:ring-0 focus-visible:ring-offset-0',
                      'overflow-visible',
                      isSubscribed ? 'pt-3' : 'pt-1',
                    )}>
                    {/* ── التاج: فوق رأس الـ avatar مباشرةً ── */}
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
                        className='object-cover scale-130'
                      />
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end' className='w-60'>
                  <DropdownMenuLabel className='py-2.5 px-3'>
                    <div className='flex flex-col gap-1'>
                      {/* اسم + pill badge صغير بجانبه */}
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
                    <Link to='/profile'>
                      {t('navigation.profile', 'Profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`${ROUTES.DASHBOARD.DashboardPage}/settings`}>
                      {t('navigation.settings', 'Settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className='text-destructive focus:text-destructive focus:bg-destructive/10'>
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

            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className='lg:hidden'>
                <Button variant='ghost' size='icon'>
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-80 overflow-y-auto'>
                <nav className='flex flex-col gap-4 mt-8'>
                  <Link
                    to={ROUTES.HOME}
                    onClick={() => setMobileMenuOpen(false)}
                    className='text-base font-medium hover:text-foreground transition-colors'>
                    {t('navigation.home')}
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
                          <span className='ml-auto text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded'>
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

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

export default Navbar;
