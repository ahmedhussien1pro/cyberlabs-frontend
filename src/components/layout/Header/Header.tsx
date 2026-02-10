import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { GlobalSearch } from './GlobalSearch'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { ProfileDropdown } from './ProfileDropdown'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

export const Header = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { to: '/', label: t('nav.home') },
    {
      to: isAuthenticated ? '/dashboard' : '/',
      label: t('nav.learning'),
    },
    { to: '/about', label: t('nav.about') },
    { to: '/paths', label: t('nav.paths') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
        isScrolled && 'shadow-md'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <MobileMenu />
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              Cyber<span className="text-primary">Labs</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 ml-8">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <ThemeToggle />
          <LanguageToggle />

          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <div className="hidden lg:flex items-center gap-2 ml-2">
              <Button variant="ghost" asChild>
                <Link to="/login">{t('auth.login')}</Link>
              </Button>
              <Button asChild>
                <Link to="/register">{t('auth.register')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
