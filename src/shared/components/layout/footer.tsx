import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Shield,
  BookOpen,
  Target,
  Award,
} from 'lucide-react';
import { Logo } from '@/shared/components/common/Logo';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/shared/constants';

export function Footer() {
  const { t } = useTranslation('footer');
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    {
      href: ROUTES.COURSES.LIST,
      label: t('footer.labs'),
      icon: <Shield className='w-4 h-4' />,
    },
    {
      href: '/paths',
      label: t('footer.learningPaths'),
      icon: <Target className='w-4 h-4' />,
    },
    {
      href: '/challenges',
      label: t('footer.challenges'),
      icon: <Award className='w-4 h-4' />,
    },
    {
      href: ROUTES.PRICING,
      label: t('footer.pricing'),
      icon: <BookOpen className='w-4 h-4' />,
    },
  ];

  const resourceLinks = [
    { href: '/docs', label: t('footer.documentation') },
    { href: '/blog', label: t('footer.blog') },
    { href: '/tutorials', label: t('footer.tutorials') },
    { href: '/community', label: t('footer.community') },
  ];

  const companyLinks = [
    { href: ROUTES.ABOUT, label: t('footer.about') },
    { href: '/careers', label: t('footer.careers') },
    { href: '/contact', label: t('footer.contact') },
    { href: '/partners', label: t('footer.partners') },
  ];

  const legalLinks = [
    { href: ROUTES.PRIVACY, label: t('footer.privacy') },
    { href: ROUTES.TERMS, label: t('footer.terms') },
    { href: '/security', label: t('footer.security') },
  ];

  const socialLinks = [
    { href: 'https://github.com/cyberlabs', icon: Github, label: 'GitHub' },
    { href: 'https://twitter.com/cyberlabs', icon: Twitter, label: 'Twitter' },
    {
      href: 'https://linkedin.com/company/cyberlabs',
      icon: Linkedin,
      label: 'LinkedIn',
    },
  ];

  return (
    <footer className='border-t bg-background mt-auto'>
      {/* Main Footer Content */}
      <div className='container py-12 mx-auto'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          {/* Brand Column */}
          <div className='lg:col-span-4 space-y-4'>
            <Logo size='md' />
            <p className='text-sm text-muted-foreground max-w-sm'>
              {t('footer.description')}
            </p>
            <div className='flex items-center gap-3'>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors'
                  aria-label={social.label}>
                  <social.icon className='h-4 w-4' />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className='lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8'>
            {/* Platform */}
            <div className='space-y-4'>
              <h4 className='text-sm font-semibold'>{t('footer.platform')}</h4>
              <ul className='space-y-3'>
                {platformLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'>
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className='space-y-4'>
              <h4 className='text-sm font-semibold'>{t('footer.resources')}</h4>
              <ul className='space-y-3'>
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className='space-y-4'>
              <h4 className='text-sm font-semibold'>{t('footer.company')}</h4>
              <ul className='space-y-3'>
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className='space-y-4'>
              <h4 className='text-sm font-semibold'>{t('footer.legal')}</h4>
              <ul className='space-y-3'>
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator />
      <div className='container py-6 mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-muted-foreground'>
          <p>
            © {currentYear} {t('footer.copyright')}
          </p>
          <div className='flex items-center gap-4'>
            <a
              href='mailto:support@cyberlabs.com'
              className='flex items-center gap-1 hover:text-foreground transition-colors'>
              <Mail className='h-4 w-4' />
              support@cyberlabs.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
