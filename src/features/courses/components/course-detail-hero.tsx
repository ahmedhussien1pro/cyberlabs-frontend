// src/features/courses/components/course-detail-hero.tsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DetailPageHero } from '@/shared/components/common/detail-page-hero';
import { ROUTES } from '@/shared/constants';
import {
  COURSE_MATRIX_COLOR,
  COURSE_STRIPE,
  COURSE_BLOOM,
  COURSE_TEXT_COLOR,
  COURSE_FALLBACK_BG,
  COURSE_ACCESS_BADGE,
} from '../constants/course-colors';
import { CourseHeroCta } from './course-hero-cta';
import type { Course } from '../types/course.types';

export interface CourseDetailHeroProps {
  course: Course;
  enrolled: boolean;
  enrolling: boolean;
  progress: number;
  done: number;
  fav: boolean;
  isPro?: boolean;
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
  done: _done,
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
  const desc  = isAr ? course.ar_description : course.description;
  const diff  = isAr ? course.ar_difficulty : course.difficulty;
  const imgSrc = course.image ?? course.thumbnail;
  const col    = course.color ?? 'blue';
  const comingSoon = course.state === 'COMING_SOON';

  const canAccess      = enrolled || (isPro && course.access !== 'FREE');
  const showProIndicator = isPro && !enrolled && course.access !== 'FREE';
  const isCompleted    = canAccess && progress >= 100;

  const statusBadge = course.isNew
    ? { label: t('card.new', 'New'), cls: 'bg-amber-500 text-white' }
    : comingSoon
      ? { label: t('card.comingSoon', 'Coming Soon'), cls: 'bg-zinc-600/80 border border-white/10 text-white' }
      : null;

  return (
    <DetailPageHero
      matrixColor={COURSE_MATRIX_COLOR[col] ?? '#3b82f6'}
      stripeClass={COURSE_STRIPE[col]}
      bloomClass={COURSE_BLOOM[col]}
      breadcrumb={
        <>
          <Link to={ROUTES.COURSES.LIST} className='transition-colors hover:text-white/70'>
            {t('detail.breadcrumbCourses', 'Courses')}
          </Link>
          <BreadcrumbChevron className='h-3 w-3 shrink-0' />
          <span className='truncate text-white/65'>{title}</span>
        </>
      }
      iconSlot={
        <div className='h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10'>
          {imgSrc ? (
            <img src={imgSrc} alt={title ?? ''} className='h-full w-full object-cover' />
          ) : (
            <div className={cn('h-full w-full flex items-center justify-center bg-gradient-to-br border', COURSE_FALLBACK_BG[col] ?? 'from-zinc-900 to-zinc-800 border-zinc-700')}>
              <p className={cn('text-[10px] font-black text-center px-1.5 leading-tight', COURSE_TEXT_COLOR[col] ?? 'text-zinc-400')}>
                {title}
              </p>
            </div>
          )}
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
          <Badge variant='outline' className={cn('rounded-full text-[11px] font-bold gap-1', COURSE_ACCESS_BADGE[course.access])}>
            {course.access === 'FREE'
              ? <span className='flex items-center gap-1'><Shield className='h-2.5 w-2.5' /> {course.access}</span>
              : <span className='flex items-center gap-1'><Shield className='h-2.5 w-2.5' /> {course.access}</span>}
          </Badge>
          <Badge variant='outline' className='rounded-full border-white/20 text-[11px] text-white/65 gap-1'>
            <Shield className='h-2.5 w-2.5' /> {diff}
          </Badge>
          <Badge variant='outline' className='rounded-full border-white/15 text-[11px] text-white/50'>
            {isAr ? course.ar_category : course.category}
          </Badge>
          {statusBadge && (
            <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold', statusBadge.cls)}>
              {statusBadge.label}
            </span>
          )}
        </>
      }
      descriptionSlot={
        <p className='mt-2 max-w-2xl text-sm leading-relaxed text-white/60'>{desc}</p>
      }
      bottomBarSlot={
        <CourseHeroCta
          course={course}
          enrolled={enrolled}
          enrolling={enrolling}
          progress={progress}
          fav={fav}
          isPro={isPro}
          hasLabs={hasLabs}
          canAccess={canAccess}
          isCompleted={isCompleted}
          showProIndicator={showProIndicator}
          onEnroll={onEnroll}
          onToggleFav={onToggleFav}
          onReset={onReset}
          onContinue={onContinue}
          onGoToLabs={onGoToLabs}
        />
      }
    />
  );
}
