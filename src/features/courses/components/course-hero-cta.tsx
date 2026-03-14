// src/features/courses/components/course-hero-cta.tsx
// CTA block used in CourseDetailHero — enroll / continue / completed actions
import {
  Clock, Zap, FlaskConical, Heart, Crown, Unlock,
  Rocket, Loader2, CheckCircle2, RotateCcw, ScrollText,
  ChevronRight, ChevronLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Star, Users, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CourseStat } from './course-stat';
import { COURSE_ACCESS_BADGE, COURSE_TEXT_COLOR } from '../constants/course-colors';
import type { Course } from '../types/course.types';

interface CourseHeroCtaProps {
  course: Course;
  enrolled: boolean;
  enrolling: boolean;
  progress: number;
  fav: boolean;
  isPro?: boolean;
  hasLabs?: boolean;
  canAccess: boolean;
  isCompleted: boolean;
  showProIndicator: boolean;
  onEnroll: () => void;
  onToggleFav: () => void;
  onReset?: () => void;
  onContinue?: () => void;
  onGoToLabs?: () => void;
}

export function CourseHeroCta({
  course,
  enrolled,
  enrolling,
  fav,
  isPro = false,
  hasLabs = false,
  canAccess,
  isCompleted,
  showProIndicator,
  onEnroll,
  onToggleFav,
  onReset,
  onContinue,
  onGoToLabs,
}: CourseHeroCtaProps) {
  const { i18n, t } = useTranslation('courses');
  const isAr = i18n.language === 'ar';
  const BreadcrumbChevron = isAr ? ChevronLeft : ChevronRight;
  const col = course.color ?? 'blue';
  const comingSoon = course.state === 'COMING_SOON';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className='contents'>

      {/* Stats */}
      <div className='flex flex-wrap items-center gap-x-5 gap-y-1.5'>
        <CourseStat
          icon={<BookOpen className='h-3.5 w-3.5' />}
          value={course.totalTopics}
          label={t('detail.topics', 'Topics')}
          textClass={COURSE_TEXT_COLOR[col]}
        />
        <CourseStat
          icon={<Clock className='h-3.5 w-3.5' />}
          value={`${course.estimatedHours}h`}
          label={t('detail.estTime', 'est.')}
          textClass={COURSE_TEXT_COLOR[col]}
        />
        <CourseStat
          icon={<FlaskConical className='h-3.5 w-3.5' />}
          value={t('detail.labsIncluded', 'Labs')}
          textClass={COURSE_TEXT_COLOR[col]}
        />
        {(course.enrollmentCount ?? 0) > 0 && (
          <CourseStat
            icon={<Users className='h-3.5 w-3.5' />}
            value={course.enrollmentCount.toLocaleString()}
            label={t('detail.enrolled', 'enrolled')}
            textClass={COURSE_TEXT_COLOR[col]}
          />
        )}
        {(course.averageRating ?? 0) > 0 && (
          <div className='flex items-center gap-1.5 text-xs'>
            <Star className='h-3.5 w-3.5 fill-yellow-500 text-yellow-500' />
            <span className='font-bold text-white'>{course.averageRating}</span>
            <span className='text-white/45'>({course.reviewCount})</span>
          </div>
        )}
      </div>

      {/* Badges row */}
      <div className='flex flex-wrap gap-2'>
        <Badge variant='outline' className={cn('rounded-full text-[11px] font-bold gap-1', COURSE_ACCESS_BADGE[course.access])}>
          {course.access === 'FREE' ? <Unlock className='h-2.5 w-2.5' /> : <Crown className='h-2.5 w-2.5' />}
          {course.access}
        </Badge>
        {showProIndicator && (
          <span className='inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400'>
            <Crown className='h-2.5 w-2.5' />
            {t('detail.proContent', 'PRO Unlocked')}
          </span>
        )}
        {isCompleted && (
          <span className='inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400'>
            <CheckCircle2 className='h-2.5 w-2.5' />
            {t('detail.completed', 'Completed')}
          </span>
        )}
      </div>

      {/* Action buttons */}
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
            <Heart className={cn('h-3.5 w-3.5 shrink-0', fav && 'fill-current')} />
            <span className='hidden sm:inline'>
              {fav ? t('detail.removeFav', 'Saved') : t('detail.addFav', 'Save')}
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
                <Button size='sm' className='h-8 gap-1.5 px-5 text-xs font-semibold' onClick={hasLabs ? onGoToLabs : onContinue}>
                  {hasLabs ? (
                    <><FlaskConical className='h-3.5 w-3.5' />{t('detail.goToLabs', 'Go to Labs')}</>
                  ) : (
                    <><ScrollText className='h-3.5 w-3.5' />{t('detail.viewCurriculum', 'Review Course')}</>
                  )}
                </Button>
                {onReset && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='outline' size='sm' className={cn('h-8 w-8 p-0', 'border-orange-500/40 bg-orange-500/5 text-orange-400', 'hover:bg-orange-500/15 hover:border-orange-500/60')}>
                        <RotateCcw className='h-3.5 w-3.5' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('detail.resetConfirmTitle', 'Reset course progress?')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('detail.resetConfirmDesc', 'Your completed topics will be cleared locally.')}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                        <AlertDialogAction className='bg-orange-500 hover:bg-orange-600 text-white' onClick={onReset}>
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
                className={cn('h-8 gap-1.5 px-5 text-xs font-semibold', !enrolled && isPro && course.access !== 'FREE' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '')}
                onClick={enrolled ? onContinue : onEnroll}>
                {enrolled ? (
                  <><Zap className='h-3.5 w-3.5' />{t('detail.continueLearning', 'Continue')}<BreadcrumbChevron className='h-3.5 w-3.5' /></>
                ) : (
                  <><Crown className='h-3.5 w-3.5' />{t('detail.unlockAndStart', 'Unlock & Start')}<BreadcrumbChevron className='h-3.5 w-3.5' /></>
                )}
              </Button>
            )
          ) : (
            <Button size='sm' className='h-8 gap-1.5 px-5 text-xs font-semibold' onClick={onEnroll} disabled={enrolling}>
              {enrolling ? (
                <><Loader2 className='h-3.5 w-3.5 animate-spin' />{t('detail.enrolling', 'Enrolling...')}</>
              ) : course.access === 'FREE' ? (
                <><Rocket className='h-3.5 w-3.5' />{t('detail.startFree', 'Start Free')}<BreadcrumbChevron className='h-3.5 w-3.5' /></>
              ) : (
                <><Crown className='h-3.5 w-3.5' />{t('detail.upgrade', 'Upgrade to {{plan}}', { plan: course.access })}<BreadcrumbChevron className='h-3.5 w-3.5' /></>
              )}
            </Button>
          )}
        </div>

        {!comingSoon && !enrolled && isPro && course.access !== 'FREE' && (
          <p className='flex items-center gap-1 text-[10px] text-blue-400/80 ps-1'>
            <Crown className='h-2.5 w-2.5' />
            {t('detail.proIncluded', 'Included in your {{plan}} plan', { plan: course.access })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
