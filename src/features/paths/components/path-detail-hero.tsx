// src/features/paths/components/path-detail-hero.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  FlaskConical,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Clock3,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { resolvePathIcon } from '../utils/path-icon';
import { getPathColors } from '../utils/path-color';
import { PathCtaCard } from './path-cta-card';
import type { LearningPath } from '../types/path.types';

interface PathDetailHeroProps {
  path: LearningPath;
}

export function PathDetailHero({ path }: PathDetailHeroProps) {
  const { t, i18n } = useTranslation('paths');
  const isAr = i18n.language === 'ar';
  const c = getPathColors(path.color);

  const title = isAr ? path.ar_title : path.title;
  const desc = isAr ? path.ar_description : path.description;
  const longDesc = isAr ? path.ar_longDescription : path.longDescription;
  const tags = isAr ? path.ar_tags : path.tags;

  // Breadcrumb chevron — flips in RTL
  const BreadcrumbChevron = isAr ? ChevronLeft : ChevronRight;

  // Exclusive badge: comingSoon > new > featured (same as PathCard)
  const badge = path.isComingSoon
    ? {
        label: t('card.comingSoon'),
        cls: 'bg-zinc-600 text-white',
        icon: <Clock3 className='h-2.5 w-2.5' />,
      }
    : path.isNew
      ? {
          label: t('card.new'),
          cls: 'bg-amber-500 text-white',
          icon: <Sparkles className='h-2.5 w-2.5' />,
        }
      : path.isFeatured
        ? {
            label: t('card.popular'),
            cls: 'bg-primary text-primary-foreground',
            icon: null,
          }
        : null;

  // Stats — omit learners until backend is ready
  const stats = [
    {
      icon: <BookOpen className='h-4 w-4' />,
      value: path.totalCourses,
      label: t('detail.courses'),
    },
    {
      icon: <FlaskConical className='h-4 w-4' />,
      value: path.totalLabs,
      label: t('detail.labs'),
    },
    {
      icon: <Clock className='h-4 w-4' />,
      value: `${path.estimatedHours}h`,
      label: t('detail.estTime'),
    },
  ];

  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-border/40',
        'bg-gradient-to-br from-background via-background to-background',
      )}>
      {/* ── Color stripe (matches PathCard top border) ───────────── */}
      <div className={cn('h-1 w-full', c.stripe)} />

      {/* ── Subtle dot pattern ───────────────────────────────────── */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'
        style={{
          backgroundImage: `radial-gradient(${colorToHex(path.color)} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Soft color bloom ─────────────────────────────────────── */}
      <div
        aria-hidden='true'
        className={cn(
          'pointer-events-none absolute -start-32 top-0 h-72 w-72 rounded-full blur-3xl opacity-10',
          bloomColor(path.color),
        )}
      />

      <div className='container relative mx-auto px-4 py-10'>
        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <nav className='mb-6 flex items-center gap-1.5 text-xs text-muted-foreground'>
          <Link
            to={ROUTES.PATHS.LIST}
            className='transition-colors hover:text-foreground'>
            {t('detail.breadcrumbPaths')}
          </Link>
          <BreadcrumbChevron className='h-3 w-3 shrink-0' />
          <span className='truncate text-foreground'>{title}</span>
        </nav>

        {/* ── Main layout ─────────────────────────────────────────── */}
        <div className='flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12'>
          {/* ── Left / Content ──────────────────────────────────── */}
          <div className='min-w-0 flex-1'>
            {/* Icon + Title block */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? 16 : -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className='flex items-start gap-4'>
              {/* Colored icon box */}
              <div
                className={cn(
                  'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl',
                  c.icon,
                )}>
                {resolvePathIcon(path.iconName, 'h-8 w-8')}
              </div>

              <div className='min-w-0'>
                <h1 className='text-3xl font-black tracking-tight leading-tight sm:text-4xl'>
                  {title}
                </h1>

                {/* Badges row */}
                <div className='mt-2.5 flex flex-wrap items-center gap-2'>
                  {/* Difficulty */}
                  <Badge variant='outline' className='rounded-full text-xs'>
                    {path.difficulty}
                  </Badge>

                  {/* Exclusive status badge */}
                  {badge && (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                        badge.cls,
                      )}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  )}

                  {/* Top 2 tags */}
                  {tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
                        c.badge,
                      )}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Short description — subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className='mt-4 text-base font-medium text-foreground/80'>
              {desc}
            </motion.p>

            {/* Long description — body */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className='mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground'>
              {longDesc}
            </motion.p>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className='mt-6 flex flex-wrap items-center gap-x-6 gap-y-2'>
              {stats.map(({ icon, value, label }) => (
                <div
                  key={label}
                  className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <span className={c.text}>{icon}</span>
                  <span className='font-bold text-foreground'>{value}</span>
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Progress bar — enrolled users only */}
            {path.enrolled && typeof path.progress === 'number' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
                className='mt-5 max-w-sm space-y-1.5'>
                <div className='flex justify-between text-xs'>
                  <span className='text-muted-foreground'>
                    {t('detail.yourProgress')}
                  </span>
                  <span className={cn('font-bold', c.text)}>
                    {path.progress}%
                  </span>
                </div>
                <Progress
                  value={path.progress}
                  className={cn('h-2 bg-muted/50', c.bar)}
                />
              </motion.div>
            )}
          </div>

          {/* ── Right: CTA Card — sticky on desktop ─────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className='w-full shrink-0 lg:sticky lg:top-20 lg:w-72'>
            <PathCtaCard path={path} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Helpers (file-private) ─────────────────────────────────────────────

/** Maps PathColor → Tailwind bg for the bloom blob */
function bloomColor(color: string): string {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
    orange: 'bg-orange-500',
    cyan: 'bg-cyan-500',
  };
  return map[color] ?? 'bg-primary';
}

/** Approximate CSS color value for radial-gradient dot pattern */
function colorToHex(color: string): string {
  const map: Record<string, string> = {
    emerald: '#10b981',
    blue: '#3b82f6',
    violet: '#8b5cf6',
    rose: '#f43f5e',
    orange: '#f97316',
    cyan: '#06b6d4',
  };
  return map[color] ?? 'hsl(var(--primary))';
}
