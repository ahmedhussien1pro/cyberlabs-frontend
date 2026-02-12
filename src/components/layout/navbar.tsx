import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { useAuthStore } from '@/core/store';
import { ROUTES } from '@/shared/constants';

export function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <nav className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        {/* Logo */}
        <Logo size='sm' />

        {/* Navigation Links */}
        <div className='hidden md:flex items-center gap-6'>
          <Link
            to={ROUTES.HOME}
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'>
            {t('common:navigation.home')}
          </Link>
          <Link
            to={ROUTES.COURSES.LIST}
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'>
            {t('common:navigation.courses')}
          </Link>
          <Link
            to={ROUTES.ABOUT}
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'>
            {t('common:navigation.about')}
          </Link>
          <Link
            to={ROUTES.PRICING}
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'>
            {t('common:navigation.pricing')}
          </Link>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-2'>
          <LanguageSwitcher />
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Button variant='ghost' size='sm' asChild>
                <Link to={ROUTES.DASHBOARD.HOME}>
                  {t('common:navigation.dashboard')}
                </Link>
              </Button>
              <Button variant='default' size='sm' asChild>
                <Link to={`/profile/${user?.username}`}>
                  {user?.username || t('common:navigation.profile')}
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant='ghost' size='sm' asChild>
                <Link to={ROUTES.AUTH.LOGIN}>Login</Link>
              </Button>
              <Button variant='default' size='sm' asChild>
                <Link to={ROUTES.AUTH.REGISTER}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
