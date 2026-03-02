import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Info,
  BookOpen,
  Clock,
  Star,
  FlaskConical,
  BookMarked,
  ArrowRight,
  Zap,
  Unlock,
  Crown,
  Gem,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ROUTES } from '@/shared/constants';
import { CourseInfoDialog } from './course-info-dialog';
import { useCourseProgressStore } from '../store/course-progress.store';
import type { Course } from '../types/course.types';

// ── Color maps (keys must match backend UPPERCASE enums) ──────────────
const ACCESS_BADGE: Record<string, string> = {
  FREE: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  PRO: 'border-blue-500/40    text-blue-400    bg-blue-500/10',
  PREMIUM: 'border-violet-500/40  text-violet-400  bg-violet-500/10',
};
const ACCESS_ICON: Record<string, React.ElementType> = {
  FREE: Unlock,
  PRO: Crown,
  PREMIUM: Gem,
};
const CONTENT_ICON: Record<string, { Icon: React.ElementType; label: string }> =
  {
    PRACTICAL: { Icon: FlaskConical, label: 'Practical' },
    THEORETICAL: { Icon: BookMarked, label: 'Theory' },
    MIXED: { Icon: BookOpen, label: 'Mixed' },
  };
// color is normalized to lowercase by normalizeCourse()
const FALLBACK_BG: Record<string, string> = {
  emerald: 'from-emerald-950 to-emerald-900 border-emerald-800/50',
  blue: 'from-blue-950    to-blue-900    border-blue-800/50',
  violet: 'from-violet-950  to-violet-900  border-violet-800/50',
  orange: 'from-orange-950  to-orange-900  border-orange-800/50',
  rose: 'from-rose-950    to-rose-900    border-rose-800/50',
  cyan: 'from-cyan-950    to-cyan-900    border-cyan-800/50',
};
const FALLBACK_TEXT: Record<string, string> = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  violet: 'text-violet-400',
  orange: 'text-orange-400',
  rose: 'text-rose-400',
  cyan: 'text-cyan-400',
};
const HOVER_RING: Record<string, string> = {
  emerald: 'hover:ring-emerald-500/30',
  blue: 'hover:ring-blue-500/30',
  violet: 'hover:ring-violet-500/30',
  orange: 'hover:ring-orange-500/30',
  rose: 'hover:ring-rose-500/30',
  cyan: 'hover:ring-cyan-500/30',
};

// ── Component ─────────────────────────────────────────────────────────
interface CourseCardProps {
  course: Course;
  view?: 'grid' | 'list';
  index?: number;
}

export function CourseCard({
  course,
  view = 'grid',
  index = 0,
}: CourseCardProps) {
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();
  const [infoOpen, setInfoOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { toggleFavorite, isFavorite, isEnrolled } = useCourseProgressStore();
  const fav = isFavorite(course.id);
  const enrolled = isEnrolled(course.id);

  const title = lang === 'ar' ? course.ar_title : course.title;
  const desc = lang === 'ar' ? course.ar_description : course.description;
  const diff = lang === 'ar' ? course.ar_difficulty : course.difficulty;
  const ct = CONTENT_ICON[course.contentType ?? 'MIXED'];
  const AccessIcon = ACCESS_ICON[course.access] ?? Unlock;
  const comingSoon = course.state === 'COMING_SOON';

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(course.id);
    toast(
      fav
        ? t('card.removedFav', 'Removed from favorites')
        : t('card.addedFav', 'Added to favorites'),
      { duration: 1500 },
    );
  };

  if (view === 'list') {
    return (
      <>
        <CourseCardList
          course={course}
          enrolled={enrolled}
          onInfo={() => setInfoOpen(true)}
          infoOpen={infoOpen}
          setInfoOpen={setInfoOpen}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'group relative flex flex-col rounded-2xl border bg-card overflow-hidden',
          'transition-all duration-300 ring-1 ring-transparent',
          HOVER_RING[course.color],
          comingSoon ? 'opacity-80' : 'hover:shadow-xl hover:-translate-y-0.5',
        )}>
        {/* Thumbnail */}
        <div className='relative aspect-video overflow-hidden bg-muted'>
          {course.image || course.thumbnail ? (
            <img
              src={course.image ?? course.thumbnail!}
              alt={title ?? ''}
              loading='lazy'
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
          ) : (
            <div
              className={cn(
                'w-full h-full flex items-center justify-center bg-gradient-to-br border',
                FALLBACK_BG[course.color] ??
                  'from-zinc-900 to-zinc-800 border-zinc-700',
              )}>
              <p
                className={cn(
                  'text-lg font-black text-center px-4 leading-tight',
                  FALLBACK_TEXT[course.color] ?? 'text-zinc-400',
                )}>
                {title}
              </p>
            </div>
          )}

          {comingSoon && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
              <span className='text-xs font-bold uppercase tracking-widest text-white/80 border border-white/20 rounded-full px-3 py-1'>
                {t('card.comingSoon', 'Coming Soon')}
              </span>
            </div>
          )}

          {!comingSoon && (
            <div className='absolute top-3 start-3'>
              <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md'>
                <span className='h-1.5 w-1.5 rounded-full bg-white' />
                {t('card.available', 'Available')}
              </span>
            </div>
          )}

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovered || fav ? 1 : 0,
              scale: isHovered || fav ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            onClick={handleFav}
            className={cn(
              'absolute top-3 end-3 h-8 w-8 rounded-full flex items-center justify-center',
              'transition-colors shadow-md',
              fav
                ? 'bg-rose-500 text-white'
                : 'bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-rose-500',
            )}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}>
            <Heart className={cn('h-4 w-4', fav && 'fill-current')} />
          </motion.button>
        </div>

        {/* Body */}
        <div className='flex flex-col flex-1 p-4 gap-3'>
          <div className='flex items-start justify-between gap-2'>
            <h3 className='text-sm font-bold text-foreground leading-snug line-clamp-2 flex-1'>
              {title}
            </h3>
            <span className='text-[11px] text-muted-foreground shrink-0'>
              {lang === 'ar' ? course.ar_category : course.category}
            </span>
          </div>

          <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
            {desc}
          </p>

          <div className='flex flex-wrap items-center gap-1.5'>
            <Badge
              variant='outline'
              className='gap-1 text-[10px] font-semibold border-border/60 bg-muted/40'>
              <BarChart3 className='h-3 w-3' /> {diff}
            </Badge>
            <Badge
              variant='outline'
              className={cn(
                'gap-1 text-[10px] font-bold',
                ACCESS_BADGE[course.access],
              )}>
              <AccessIcon className='h-3 w-3' />
              {course.access}
            </Badge>
            {course.totalTopics > 0 && (
              <Badge
                variant='outline'
                className='gap-1 text-[10px] font-semibold text-primary border-primary/30 bg-primary/5'>
                <Clock className='h-3 w-3' /> {course.totalTopics}{' '}
                {t('card.topics', 'Topics')}
              </Badge>
            )}
            {ct && (
              <Badge
                variant='outline'
                className='gap-1 text-[10px] text-muted-foreground border-border/40'>
                <ct.Icon className='h-3 w-3' /> {ct.label}
              </Badge>
            )}
          </div>

          <div className='flex gap-2 mt-auto pt-1'>
            <Button
              variant='outline'
              size='sm'
              className='flex-1 h-9 text-xs border-border/60 hover:bg-muted'
              onClick={() => setInfoOpen(true)}>
              <Info className='h-3.5 w-3.5 me-1.5' />
              {t('card.moreInfo', 'More Info')}
            </Button>
            <Button
              size='sm'
              className='flex-1 h-9 text-xs'
              disabled={comingSoon}
              onClick={() => navigate(ROUTES.COURSES.DETAIL(course.slug))}>
              {enrolled ? (
                <>
                  <Zap className='h-3.5 w-3.5 me-1' />
                  {t('card.continueLearning', 'Continue')}
                </>
              ) : (
                <>
                  {t('card.startLearning', 'Start Learning')}
                  <ArrowRight className='h-3.5 w-3.5 ms-1.5' />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      <CourseInfoDialog
        course={course}
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
      />
    </>
  );
}

// ── List variant ───────────────────────────────────────────────────────
function CourseCardList({
  course,
  enrolled,
  onInfo,
  infoOpen,
  setInfoOpen,
}: {
  course: Course;
  enrolled: boolean;
  onInfo: () => void;
  infoOpen: boolean;
  setInfoOpen: (v: boolean) => void;
}) {
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useCourseProgressStore();
  const fav = isFavorite(course.id);
  const title = lang === 'ar' ? course.ar_title : course.title;
  const desc = lang === 'ar' ? course.ar_description : course.description;
  const diff = lang === 'ar' ? course.ar_difficulty : course.difficulty;
  const AccessIcon = ACCESS_ICON[course.access] ?? Unlock;

  return (
    <>
      <div className='group flex gap-4 rounded-2xl border border-border/50 bg-card p-4 hover:border-border hover:shadow-md transition-all'>
        <div className='relative h-24 w-36 rounded-xl overflow-hidden shrink-0 bg-muted'>
          {course.image || course.thumbnail ? (
            <img
              src={course.image ?? course.thumbnail!}
              alt={title ?? ''}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            />
          ) : (
            <div
              className={cn(
                'w-full h-full flex items-center justify-center bg-gradient-to-br',
                FALLBACK_BG[course.color] ?? 'from-zinc-900 to-zinc-800',
              )}>
              <p
                className={cn(
                  'text-xs font-bold text-center px-2',
                  FALLBACK_TEXT[course.color] ?? 'text-zinc-400',
                )}>
                {title}
              </p>
            </div>
          )}
        </div>

        <div className='flex-1 min-w-0 flex flex-col gap-1.5'>
          <div className='flex items-start justify-between gap-2'>
            <h3 className='text-sm font-bold text-foreground line-clamp-1'>
              {title}
            </h3>
            <button
              onClick={() => toggleFavorite(course.id)}
              className={cn(
                'shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-colors',
                fav
                  ? 'text-rose-500'
                  : 'text-muted-foreground/40 hover:text-rose-500',
              )}>
              <Heart className={cn('h-4 w-4', fav && 'fill-current')} />
            </button>
          </div>

          <p className='text-xs text-muted-foreground line-clamp-2'>{desc}</p>

          <div className='flex flex-wrap gap-1.5 mt-auto'>
            <Badge variant='outline' className='gap-1 text-[10px]'>
              <BarChart3 className='h-3 w-3' /> {diff}
            </Badge>
            <Badge
              variant='outline'
              className={cn(
                'gap-1 text-[10px] font-bold',
                ACCESS_BADGE[course.access],
              )}>
              <AccessIcon className='h-3 w-3' /> {course.access}
            </Badge>
            {(course.averageRating ?? 0) > 0 && (
              <span className='flex items-center gap-1 text-[10px] text-yellow-500'>
                <Star className='h-3 w-3 fill-yellow-500' />{' '}
                {course.averageRating}
              </span>
            )}
          </div>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='h-8 text-xs px-3'
              onClick={onInfo}>
              <Info className='h-3 w-3 me-1' />{' '}
              {t('card.moreInfo', 'More Info')}
            </Button>
            <Button
              size='sm'
              className='h-8 text-xs px-3'
              disabled={course.state === 'COMING_SOON'}
              onClick={() => navigate(ROUTES.COURSES.DETAIL(course.slug))}>
              {enrolled ? (
                <>
                  <Zap className='h-3 w-3 me-1' />
                  {t('card.continueLearning', 'Continue')}
                </>
              ) : (
                t('card.startLearning', 'Start Learning')
              )}
            </Button>
          </div>
        </div>
      </div>

      <CourseInfoDialog
        course={course}
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
      />
    </>
  );
}
