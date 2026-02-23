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
  Lock,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { MatrixRain } from '@/shared/components/common/landing/matrix-rain';
import { resolvePathIcon } from '../utils/path-icon';
import { getPathColors } from '../utils/path-color';
import type { LearningPath, PathColor } from '../types/path.types';

const MATRIX_COLOR: Record<PathColor, string> = {
  emerald: '#10b981',
  blue: '#3b82f6',
  violet: '#8b5cf6',
  rose: '#f43f5e',
  orange: '#f97316',
  cyan: '#06b6d4',
};

interface PathDetailHeroProps {
  path: LearningPath;
}

export function PathDetailHero({ path }: PathDetailHeroProps) {
  const { t, i18n } = useTranslation('paths');
  const isAr = i18n.language === 'ar';
  const c = getPathColors(path.color);

  const title = isAr ? path.ar_title : path.title;
  const desc = isAr ? path.ar_description : path.description;
  const tags = isAr ? path.ar_tags : path.tags;

  const BreadcrumbChevron = isAr ? ChevronLeft : ChevronRight;

  // Exclusive badge
  const badge = path.isComingSoon
    ? {
        label: t('card.comingSoon'),
        cls: 'bg-zinc-600/80 border border-white/10 text-white',
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

  const freeCount = path.modules.filter((m) => !m.isLocked).length;
  const lockedCount = path.modules.filter((m) => m.isLocked).length;

  return (
    <section className='relative overflow-hidden border-b border-white/8 bg-zinc-950'>
      {/* ── Color stripe ──────────────────────────────────────────── */}
      <div className={cn('absolute inset-x-0 top-0 z-[3] h-[3px]', c.stripe)} />

      {/* ── Matrix Rain ───────────────────────────────────────────── */}
      <MatrixRain
        color={MATRIX_COLOR[path.color] ?? '#22c55e'}
        opacity={0.07}
        speed={6}
      />

      {/* ── Bloom ─────────────────────────────────────────────────── */}
      <div
        aria-hidden='true'
        className={cn(
          'pointer-events-none absolute -start-20 -top-10 z-[1]',
          'h-56 w-56 rounded-full blur-3xl opacity-[0.12]',
          bloomBg(path.color),
        )}
      />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className='container relative z-[2] mx-auto px-4'>
        {/* ── Top block: breadcrumb + main row ──────────────────── */}
        <div className='py-6'>
          {/* Breadcrumb */}
          <nav className='mb-4 flex items-center gap-1 text-[11px] text-white/35'>
            <Link
              to={ROUTES.PATHS.LIST}
              className='transition-colors hover:text-white/70'>
              {t('detail.breadcrumbPaths')}
            </Link>
            <BreadcrumbChevron className='h-3 w-3 shrink-0' />
            <span className='truncate text-white/65'>{title}</span>
          </nav>

          {/* ── Main row: icon / text / right-actions ─────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='flex items-start gap-4'>
            {/* Icon box */}
            <div
              className={cn(
                'hidden sm:flex h-14 w-14 shrink-0 items-center',
                'justify-center rounded-2xl ring-1 ring-white/10',
                c.icon,
              )}>
              {resolvePathIcon(path.iconName, 'h-7 w-7')}
            </div>

            {/* Text block — grows */}
            <div className='min-w-0 flex-1'>
              {/* Title */}
              <h1 className='text-xl font-black leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl'>
                {title}
              </h1>

              {/* Badges */}
              <div className='mt-2 flex flex-wrap items-center gap-1.5'>
                <Badge
                  variant='outline'
                  className='rounded-full border-white/20 text-[11px] text-white/65'>
                  {path.difficulty}
                </Badge>

                {badge && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
                      'text-[10px] font-bold',
                      badge.cls,
                    )}>
                    {badge.icon}
                    {badge.label}
                  </span>
                )}

                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                      c.badge,
                    )}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className='mt-2 max-w-2xl text-sm leading-relaxed text-white/60'>
                {desc}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar: stats + progress + CTA — all in one line ─ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className={cn(
            'flex flex-wrap items-center justify-between gap-x-6 gap-y-3',
            'border-t border-white/10 py-3',
          )}>
          {/* Left: stats */}
          <div className='flex flex-wrap items-center gap-x-5 gap-y-1.5'>
            {/* Courses */}
            <Stat
              icon={<BookOpen className='h-3.5 w-3.5' />}
              value={path.totalCourses}
              label={t('detail.courses')}
              textClass={c.text}
            />
            {/* Labs */}
            <Stat
              icon={<FlaskConical className='h-3.5 w-3.5' />}
              value={path.totalLabs}
              label={t('detail.labs')}
              textClass={c.text}
            />
            {/* Time */}
            <Stat
              icon={<Clock className='h-3.5 w-3.5' />}
              value={`${path.estimatedHours}h`}
              label={t('detail.estTime')}
              textClass={c.text}
            />

            {/* Free / Pro breakdown */}
            <div className='hidden sm:flex items-center gap-1.5 text-[11px] text-white/40'>
              <span className='text-white/60 font-medium'>{freeCount}</span>
              <span>{t('detail.freeContent')}</span>
              {lockedCount > 0 && (
                <>
                  <span className='opacity-30'>·</span>
                  <Lock className='h-2.5 w-2.5' />
                  <span className='text-white/60 font-medium'>
                    {lockedCount}
                  </span>
                  <span>{t('detail.requiresPro')}</span>
                </>
              )}
            </div>
          </div>

          {/* Center: progress (enrolled only) */}
          {path.enrolled && typeof path.progress === 'number' && (
            <div className='flex items-center gap-2.5 min-w-[160px]'>
              <Progress
                value={path.progress}
                className={cn('h-1.5 flex-1 bg-white/10', c.bar)}
              />
              <span className={cn('text-xs font-bold shrink-0', c.text)}>
                {path.progress}%
              </span>
            </div>
          )}

          {/* Right: CTA */}
          <div className='flex items-center gap-2'>
            {path.completedAt && (
              <span
                className={cn(
                  'hidden sm:flex items-center gap-1 text-[11px] font-semibold',
                  c.text,
                )}>
                <Trophy className='h-3.5 w-3.5' />
                {t('detail.completedPath')}
              </span>
            )}

            {path.isComingSoon ? (
              <div
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border border-white/15',
                  'bg-white/5 px-4 py-1.5 text-xs text-white/50',
                )}>
                <Clock3 className='h-3.5 w-3.5' />
                {t('card.comingSoon')}
              </div>
            ) : (
              <Button
                size='sm'
                className='h-8 gap-1.5 px-5 text-xs font-semibold'>
                {path.enrolled
                  ? t('detail.continueLearning')
                  : t('detail.startThisPath')}
                <BreadcrumbChevron className='h-3.5 w-3.5' />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── File-private helpers ──────────────────────────────────────────────

interface StatProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  textClass: string;
}

function Stat({ icon, value, label, textClass }: StatProps) {
  return (
    <div className='flex items-center gap-1.5 text-xs'>
      <span className={textClass}>{icon}</span>
      <span className='font-bold text-white'>{value}</span>
      <span className='text-white/45'>{label}</span>
    </div>
  );
}

function bloomBg(color: PathColor | string): string {
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
