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
  Lock,
  Trophy,
  LayoutGrid,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { DetailPageHero } from '@/shared/components/common/detail-page-hero';
import { useCourseProgressStore } from '@/features/courses/store/course-progress.store';
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
const BLOOM_BG: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  orange: 'bg-orange-500',
  cyan: 'bg-cyan-500',
};

interface PathDetailHeroProps {
  path: LearningPath;
  onStartPath?: () => void; // ← جديد
}

export function PathDetailHero({ path, onStartPath }: PathDetailHeroProps) {
  const { t, i18n } = useTranslation('paths');
  const isAr = i18n.language === 'ar';
  const c = getPathColors(path.color);
  const BreadcrumbChevron = isAr ? ChevronLeft : ChevronRight;

  // ── حالة الـ enrollment من الـ store ──────────────────────────────
  const { isEnrolled, completedTopics } = useCourseProgressStore();

  // نحسب كم كورس في الباث اتبدأ فعلاً
  const enrolledModulesCount = path.modules.filter((m) => {
    const courseId = (m.course as any)?.id ?? '';
    return courseId ? isEnrolled(courseId) : false;
  }).length;

  const completedModulesCount = path.modules.filter((m) => {
    const courseId = (m.course as any)?.id ?? '';
    if (!courseId) return !!m.userProgress?.isCompleted;
    const topicsDone = completedTopics[courseId]?.length ?? 0;
    const totalTopics = (m.course as any)?.totalTopics ?? 0;
    return totalTopics > 0 && topicsDone >= totalTopics;
  }).length;

  const totalModules = path.modules.length;
  const hasStarted = enrolledModulesCount > 0 || (path.enrolled ?? false);
  const isCompleted = completedModulesCount >= totalModules && totalModules > 0;
  const progressPct =
    totalModules > 0
      ? Math.round((completedModulesCount / totalModules) * 100)
      : (path.progress ?? 0);

  // ── بقية data ──────────────────────────────────────────────────────
  const title = isAr ? path.ar_title : path.title;
  const desc = isAr ? path.ar_description : path.description;
  const tags = isAr ? path.ar_tags : path.tags;

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
    <DetailPageHero
      matrixColor={MATRIX_COLOR[path.color] ?? '#22c55e'}
      stripeClass={c.stripe}
      bloomClass={BLOOM_BG[path.color]}
      breadcrumb={
        <>
          <Link
            to={ROUTES.PATHS.LIST}
            className='transition-colors hover:text-white/70'>
            {t('detail.breadcrumbPaths')}
          </Link>
          <BreadcrumbChevron className='h-3 w-3 shrink-0' />
          <span className='truncate text-white/65'>{title}</span>
        </>
      }
      iconSlot={
        <div
          className={cn(
            'h-14 w-14 flex items-center justify-center rounded-2xl ring-1 ring-white/10',
            c.icon,
          )}>
          {resolvePathIcon(path.iconName, 'h-7 w-7')}
        </div>
      }
      titleSlot={
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='text-xl font-black leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl'>
          {title}
        </motion.h1>
      }
      badgesSlot={
        <>
          <Badge
            variant='outline'
            className='rounded-full border-white/20 text-[11px] text-white/65'>
            {path.difficulty}
          </Badge>
          {badge && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
                badge.cls,
              )}>
              {badge.icon}
              {badge.label}
            </span>
          )}
          {/* Completed badge */}
          {isCompleted && (
            <span className='inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400'>
              <CheckCircle2 className='h-2.5 w-2.5' />
              {t('detail.completedPath', 'Completed')}
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
        </>
      }
      descriptionSlot={
        <p className='mt-2 max-w-2xl text-sm leading-relaxed text-white/60'>
          {desc}
        </p>
      }
      bottomBarSlot={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className='contents'>
          {/* Stats */}
          <div className='flex flex-wrap items-center gap-x-5 gap-y-1.5'>
            <Stat
              icon={<BookOpen className='h-3.5 w-3.5' />}
              value={path.totalCourses}
              label={t('detail.courses')}
              textClass={c.text}
            />
            <Stat
              icon={<FlaskConical className='h-3.5 w-3.5' />}
              value={path.totalLabs}
              label={t('detail.labs')}
              textClass={c.text}
            />
            <Stat
              icon={<Clock className='h-3.5 w-3.5' />}
              value={`${path.estimatedHours}h`}
              label={t('detail.estTime')}
              textClass={c.text}
            />
            <div className='hidden sm:flex items-center gap-1.5 text-[11px] text-white/40'>
              <LayoutGrid className='h-3 w-3' />
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

          {/* Progress — يظهر لو بدأ فعلاً */}
          {hasStarted && (
            <div className='flex items-center gap-2.5 min-w-[160px]'>
              <Progress
                value={progressPct}
                className={cn('h-1.5 flex-1 bg-white/10', c.bar)}
              />
              <span className={cn('text-xs font-bold shrink-0', c.text)}>
                {completedModulesCount}/{totalModules}
              </span>
            </div>
          )}

          {/* CTA */}
          <div className='flex items-center gap-2'>
            {isCompleted && (
              <span
                className={cn(
                  'hidden sm:flex items-center gap-1 text-[11px] font-semibold',
                  c.text,
                )}>
                <Trophy className='h-3.5 w-3.5' />
                {t('detail.completedPath', 'Path Completed!')}
              </span>
            )}

            {path.isComingSoon ? (
              <div className='flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/50'>
                <Clock3 className='h-3.5 w-3.5' />
                {t('card.comingSoon')}
              </div>
            ) : (
              <Button
                size='sm'
                className='h-8 gap-1.5 px-5 text-xs font-semibold'
                onClick={onStartPath}>
                {isCompleted ? (
                  /* مكتمل → Review Path */
                  <>
                    <Trophy className='h-3.5 w-3.5' />
                    {t('detail.reviewPath', 'Review Path')}
                    <BreadcrumbChevron className='h-3.5 w-3.5' />
                  </>
                ) : hasStarted ? (
                  /* بدأ ولسه ناقص → Continue */
                  <>
                    {t('detail.continueLearning', 'Continue')}
                    <BreadcrumbChevron className='h-3.5 w-3.5' />
                  </>
                ) : (
                  /* لم يبدأ → Start */
                  <>
                    {t('detail.startThisPath', 'Start This Path')}
                    <BreadcrumbChevron className='h-3.5 w-3.5' />
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      }
    />
  );
}

function Stat({
  icon,
  value,
  label,
  textClass,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  textClass: string;
}) {
  return (
    <div className='flex items-center gap-1.5 text-xs'>
      <span className={textClass}>{icon}</span>
      <span className='font-bold text-white'>{value}</span>
      <span className='text-white/45'>{label}</span>
    </div>
  );
}
