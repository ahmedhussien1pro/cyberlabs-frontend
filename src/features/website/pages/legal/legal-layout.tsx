// src/features/website/pages/legal/legal-layout.tsx
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  FileText,
  Scale,
  Lock,
  User,
  Cookie,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/shared/constants';

export type SectionIcon =
  | 'shield'
  | 'document'
  | 'lock'
  | 'cookie'
  | 'user'
  | 'scale';

export type LegalSection = {
  id: string;
  icon?: SectionIcon;
  title: string;
  content: ReactNode;
};

type LegalLayoutProps = {
  namespace: 'privacy' | 'terms';
  icon?: 'shield' | 'document' | 'scale';
  sections: LegalSection[];
};

const iconMap: Record<
  SectionIcon,
  React.ComponentType<{ className?: string }>
> = {
  shield: Shield,
  document: FileText,
  lock: Lock,
  cookie: Cookie,
  user: User,
  scale: Scale,
};

export function LegalLayout({
  namespace,
  icon = 'document',
  sections,
}: LegalLayoutProps) {
  const { t, i18n } = useTranslation(namespace);
  const isRTL = i18n.language === 'ar';

  const HeaderIcon =
    icon === 'shield' ? Shield : icon === 'scale' ? Scale : FileText;

  return (
    <div className='min-h-screen bg-background'>
      {/* Top bar */}
      <div className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 py-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link to={ROUTES.HOME} className='flex items-center gap-2'>
              {isRTL ? (
                <ArrowRight className='w-4 h-4' />
              ) : (
                <ArrowLeft className='w-4 h-4' />
              )}
              {t('backToHome')}
            </Link>
          </Button>
        </div>
      </div>

      <div className='container mx-auto px-4 py-10 max-w-6xl'>
        {/* Hero */}
        <div className='mb-10 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-primary/3 to-background px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
          <div className='space-y-3'>
            <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary'>
              <HeaderIcon className='h-3.5 w-3.5' />
              <span>{t('badge')}</span>
            </div>
            <h1 className='text-3xl sm:text-4xl font-bold tracking-tight'>
              {t('title')}
            </h1>
            <p className='text-sm text-muted-foreground'>{t('lastUpdated')}</p>
          </div>
          <p className='text-sm text-muted-foreground max-w-xs leading-relaxed'>
            {t('summary')}
          </p>
        </div>

        {/* Body: TOC + Sections */}
        <div className='grid gap-8 lg:grid-cols-[240px,1fr]'>
          {/* Sticky TOC – desktop only */}
          <aside className='hidden lg:block'>
            <Card className='sticky top-24 p-4'>
              <p className='mb-3 text-sm font-semibold text-foreground'>
                {t('tocTitle')}
              </p>
              <nav className='space-y-0.5'>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className='block rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'>
                    {s.title}
                  </a>
                ))}
              </nav>
            </Card>
          </aside>

          {/* Section cards */}
          <main className='space-y-5'>
            {sections.map((s) => {
              const Icon = s.icon ? iconMap[s.icon] : undefined;
              return (
                <Card key={s.id} id={s.id} className='scroll-mt-28 p-6 sm:p-8'>
                  <div className='flex items-start gap-3 mb-5'>
                    {Icon && (
                      <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Icon className='h-4 w-4' />
                      </div>
                    )}
                    <h2 className='text-xl sm:text-2xl font-semibold leading-snug'>
                      {s.title}
                    </h2>
                  </div>
                  <div className='prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed'>
                    {s.content}
                  </div>
                </Card>
              );
            })}

            <p className='text-xs text-center text-muted-foreground pt-2 pb-8'>
              {t('disclaimer')}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
