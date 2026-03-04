// src/features/courses/components/course-detail-hero.tsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Clock,
  Users,
  Star,
  Zap,
  Shield,
  FlaskConical,
  Heart,
  Crown,
  Unlock,
  Rocket,
  Loader2,
  CheckCircle2,
  RotateCcw,
  ScrollText,
  ChevronRight,
  ChevronLeft,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { DetailPageHero } from '@/shared/components/common/detail-page-hero';
import { ROUTES } from '@/shared/constants';
import type { Course } from '../types/course.types';

// ── Color maps ────────────────────────────────────────────────────────
const MATRIX_COLOR: Record<string, string> = {
  emerald: '#10b981',
  blue: '#3b82f6',
  violet: '#8b5cf6',
  rose: '#f43f5e',
  orange: '#f97316',
  cyan: '#06b6d4',
};
const STRIPE: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  orange: 'bg-orange-500',
  cyan: 'bg-cyan-500',
};
const BLOOM: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  orange: 'bg-orange-500',
  cyan: 'bg-cyan-500',
};
const TEXT_COLOR: Record<string, string> = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
  orange: 'text-orange-400',
  cyan: 'text-cyan-400',
};

const FALLBACK_BG: Record<string, string> = {
  emerald: 'from-emerald-950 to-emerald-900',
  blue: 'from-blue-950 to-blue-900',
  violet: 'from-violet-950 to-violet-900',
  orange: 'from-orange-950 to-orange-900',
  rose: 'from-rose-950 to-rose-900',
  cyan: 'from-cyan-950 to-cyan-900',
};
const ACCESS_BADGE: Record<string, string> = {
  FREE: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  PRO: 'border-blue-500/40    text-blue-400    bg-blue-500/10',
  PREMIUM: 'border-violet-500/40  text-violet-400  bg-violet-500/10',
};

export interface CourseDetailHeroProps {
  course: Course;
  enrolled: boolean;
  enrolling: boolean;
  progress: number;
  done: number;
  fav: boolean;
  isPro?: boolean; // ← المستخدم عنده subscription تشمل هذا الكورس
  hasLabs?: boolean;
  onEnroll: () => void;
  onToggleFav: () => void;
  onReset?: () => void;
  onContinue?: () => void;
  onGoToLabs?: () => void;
}

export function CourseDetailHero({
  course,
  enrolled,
  enrolling,
  progress,
  done,
  fav,
  isPro = false,
  hasLabs = false,
  onEnroll,
  onToggleFav,
  onReset,
  onContinue,
  onGoToLabs,
}: CourseDetailHeroProps) {
  const { i18n, t } = useTranslation('courses');
  const isAr = i18n.language === 'ar';
  const BreadcrumbChevron = isAr ? ChevronLeft : ChevronRight;

  const title = isAr ? course.ar_title : course.title;
  const desc = isAr ? course.ar_description : course.description;
  const diff = isAr ? course.ar_difficulty : course.difficulty;
  const imgSrc = course.image ?? course.thumbnail;
  const comingSoon = course.state === 'COMING_SOON';
  const col = course.color ?? 'blue';

  // ── Access logic ──────────────────────────────────────────────────
  // canAccess: enrolled عادي، أو عنده pro subscription تغطي الكورس
  const canAccess = enrolled || (isPro && course.access !== 'FREE');
  // showProIndicator: يظهر badge إن الكورس مدفوع وعنده pro
  const showProIndicator = isPro && !enrolled && course.access !== 'FREE';
  const isCompleted = canAccess && progress >= 100;

  // ── Status badge (نفس منطق الباث) ────────────────────────────────
  const statusBadge = course.isNew
    ? { label: t('card.new', 'New'), cls: 'bg-amber-500 text-white' }
    : comingSoon
      ? {
          label: t('card.comingSoon', 'Coming Soon'),
          cls: 'bg-zinc-600/80 border border-white/10 text-white',
        }
      : null;

  return (
    <DetailPageHero
      matrixColor={MATRIX_COLOR[col] ?? '#3b82f6'}
      stripeClass={STRIPE[col]}
      bloomClass={BLOOM[col]}
      /* ── Breadcrumb: Courses → title ── */
      breadcrumb={
        <>
          <Link
            to={ROUTES.COURSES.LIST}
            className='transition-colors hover:text-white/70'>
            {t('detail.breadcrumbCourses', 'Courses')}
          </Link>
          <BreadcrumbChevron className='h-3 w-3 shrink-0' />
          <span className='truncate text-white/65'>{title}</span>
        </>
      }
      /* ── Icon: thumbnail مصغّر (نفس شكل icon box الباث) ── */
      iconSlot={
        <div className='h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10'>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={title ?? ''}
              className='h-full w-full object-cover'
            />
          ) : (
            <div
              className={cn(
                'h-full w-full flex items-center justify-center bg-gradient-to-br border',
                FALLBACK_BG[col] ?? 'from-zinc-900 to-zinc-800 border-zinc-700',
              )}>
              <p
                className={cn(
                  'text-[10px] font-black text-center px-1.5 leading-tight',
                  TEXT_COLOR[col] ?? 'text-zinc-400',
                )}>
                {title}
              </p>
            </div>
          )}
        </div>
      }
      /* ── Title ── */
      titleSlot={
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='text-xl font-black leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl'>
          {title}
        </motion.h1>
      }
      /* ── Badges — نفس تنسيق الباث تماماً ── */
      badgesSlot={
        <>
          {/* Access */}
          <Badge
            variant='outline'
            className={cn(
              'rounded-full text-[11px] font-bold gap-1',
              ACCESS_BADGE[course.access],
            )}>
            {course.access === 'FREE' ? (
              <Unlock className='h-2.5 w-2.5' />
            ) : (
              <Crown className='h-2.5 w-2.5' />
            )}
            {course.access}
          </Badge>

          {/* Difficulty */}
          <Badge
            variant='outline'
            className='rounded-full border-white/20 text-[11px] text-white/65 gap-1'>
            <Shield className='h-2.5 w-2.5' /> {diff}
          </Badge>

          {/* Category */}
          <Badge
            variant='outline'
            className='rounded-full border-white/15 text-[11px] text-white/50'>
            {isAr ? course.ar_category : course.category}
          </Badge>

          {/* Status badge (New / Coming Soon) */}
          {statusBadge && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
                statusBadge.cls,
              )}>
              {statusBadge.label}
            </span>
          )}

          {/* PRO indicator — عنده pro subscription والكورس مدفوع */}
          {showProIndicator && (
            <span className='inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400'>
              <Crown className='h-2.5 w-2.5' />
              {t('detail.proContent', 'PRO Unlocked')}
            </span>
          )}

          {/* Completed */}
          {isCompleted && (
            <span className='inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400'>
              <CheckCircle2 className='h-2.5 w-2.5' />
              {t('detail.completed', 'Completed')}
            </span>
          )}
        </>
      }
      /* ── Description ── */
      descriptionSlot={
        <p className='mt-2 max-w-2xl text-sm leading-relaxed text-white/60'>
          {desc}
        </p>
      }
      /* ── Bottom bar: stats + progress + CTA في سطر واحد ── */
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
              value={course.totalTopics}
              label={t('detail.topics', 'Topics')}
              textClass={TEXT_COLOR[col]}
            />
            <Stat
              icon={<Clock className='h-3.5 w-3.5' />}
              value={`${course.estimatedHours}h`}
              label={t('detail.estTime', 'est.')}
              textClass={TEXT_COLOR[col]}
            />
            <Stat
              icon={<FlaskConical className='h-3.5 w-3.5' />}
              value={t('detail.labsIncluded', 'Labs')}
              textClass={TEXT_COLOR[col]}
            />
            {(course.enrollmentCount ?? 0) > 0 && (
              <Stat
                icon={<Users className='h-3.5 w-3.5' />}
                value={course.enrollmentCount.toLocaleString()}
                label={t('detail.enrolled', 'enrolled')}
                textClass={TEXT_COLOR[col]}
              />
            )}
            {(course.averageRating ?? 0) > 0 && (
              <div className='flex items-center gap-1.5 text-xs'>
                <Star className='h-3.5 w-3.5 fill-yellow-500 text-yellow-500' />
                <span className='font-bold text-white'>
                  {course.averageRating}
                </span>
                <span className='text-white/45'>({course.reviewCount})</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className='flex flex-col items-start gap-1.5'>
            <div className='flex items-center gap-2'>
              {/* Favorite */}
              <button
                onClick={onToggleFav}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                  fav
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-500 hover:bg-rose-500/15'
                    : 'border-white/15 text-white/50 hover:border-rose-500/30 hover:text-rose-500',
                )}>
                <Heart
                  className={cn('h-3.5 w-3.5 shrink-0', fav && 'fill-current')}
                />
                <span className='hidden sm:inline'>
                  {fav
                    ? t('detail.removeFav', 'Saved')
                    : t('detail.addFav', 'Save')}
                </span>
              </button>

              {/* Main CTA */}
              {comingSoon ? (
                <div className='flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/50'>
                  <Clock className='h-3.5 w-3.5' />
                  {t('card.comingSoon', 'Coming Soon')}
                </div>
              ) : canAccess ? (
                isCompleted ? (
                  <>
                    <Button
                      size='sm'
                      className='h-8 gap-1.5 px-5 text-xs font-semibold'
                      onClick={hasLabs ? onGoToLabs : onContinue}>
                      {hasLabs ? (
                        <>
                          <FlaskConical className='h-3.5 w-3.5' />
                          {t('detail.goToLabs', 'Go to Labs')}
                        </>
                      ) : (
                        <>
                          <ScrollText className='h-3.5 w-3.5' />
                          {t('detail.viewCurriculum', 'Review Course')}
                        </>
                      )}
                    </Button>
                    {onReset && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant='outline'
                            size='sm'
                            className={cn(
                              'h-8 w-8 p-0',
                              'border-orange-500/40 bg-orange-500/5 text-orange-400',
                              'hover:bg-orange-500/15 hover:border-orange-500/60',
                            )}>
                            <RotateCcw className='h-3.5 w-3.5' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t(
                                'detail.resetConfirmTitle',
                                'Reset course progress?',
                              )}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t(
                                'detail.resetConfirmDesc',
                                'Your completed topics will be cleared locally.',
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {t('common.cancel', 'Cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className='bg-orange-500 hover:bg-orange-600 text-white'
                              onClick={onReset}>
                              {t('detail.resetConfirm', 'Yes, Reset')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </>
                ) : (
                  <Button
                    size='sm'
                    className={cn(
                      'h-8 gap-1.5 px-5 text-xs font-semibold',
                      !enrolled && isPro && course.access !== 'FREE'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : '',
                    )}
                    onClick={enrolled ? onContinue : onEnroll}>
                    {enrolled ? (
                      <>
                        <Zap className='h-3.5 w-3.5' />
                        {t('detail.continueLearning', 'Continue')}
                        <BreadcrumbChevron className='h-3.5 w-3.5' />
                      </>
                    ) : (
                      <>
                        <Crown className='h-3.5 w-3.5' />
                        {t('detail.unlockAndStart', 'Unlock & Start')}
                        <BreadcrumbChevron className='h-3.5 w-3.5' />
                      </>
                    )}
                  </Button>
                )
              ) : (
                /* لا enrolled ولا pro */
                <Button
                  size='sm'
                  className='h-8 gap-1.5 px-5 text-xs font-semibold'
                  onClick={onEnroll}
                  disabled={enrolling}>
                  {enrolling ? (
                    <>
                      <Loader2 className='h-3.5 w-3.5 animate-spin' />
                      {t('detail.enrolling', 'Enrolling...')}
                    </>
                  ) : course.access === 'FREE' ? (
                    <>
                      <Rocket className='h-3.5 w-3.5' />
                      {t('detail.startFree', 'Start Free')}
                      <BreadcrumbChevron className='h-3.5 w-3.5' />
                    </>
                  ) : (
                    <>
                      <Crown className='h-3.5 w-3.5' />
                      {t('detail.upgrade', 'Upgrade to {{plan}}', {
                        plan: course.access,
                      })}
                      <BreadcrumbChevron className='h-3.5 w-3.5' />
                    </>
                  )}
                </Button>
              )}
            </div>

            {!comingSoon && !enrolled && isPro && course.access !== 'FREE' && (
              <p className='flex items-center gap-1 text-[10px] text-blue-400/80 ps-1'>
                <Crown className='h-2.5 w-2.5' />
                {t('detail.proIncluded', 'Included in your {{plan}} plan', {
                  plan: course.access,
                })}
              </p>
            )}
          </div>
        </motion.div>
      }
    />
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────
function Stat({
  icon,
  value,
  label,
  textClass,
}: {
  icon: React.ReactNode;
  value?: number | string;
  label?: string;
  textClass: string;
}) {
  return (
    <div className='flex items-center gap-1.5 text-xs'>
      <span className={textClass}>{icon}</span>
      <span className='font-bold text-white'>{value}</span>
      {label && <span className='text-white/45'>{label}</span>}
    </div>
  );
}
