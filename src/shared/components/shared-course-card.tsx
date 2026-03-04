// src/shared/components/shared-course-card.tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FlaskConical,
  BookMarked,
  BarChart3,
  Clock,
  ArrowRight,
  Unlock,
  Crown,
  Gem,
  Heart,
  Info,
  Zap,
  Sparkles,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { ROUTES } from '@/shared/constants';

export interface CourseCardData {
  id: string;
  slug: string;
  title: string;
  ar_title?: string;
  description?: string;
  ar_description?: string;
  thumbnail?: string;
  image?: string;
  color?: string;
  difficulty?: string;
  ar_difficulty?: string;
  access?: string;
  contentType?: string;
  category?: string;
  ar_category?: string;
  totalTopics?: number;
  estimatedHours?: number;
  state?: string;
  averageRating?: number;
}

export interface SharedCourseCardProps {
  course: CourseCardData;
  variant?: 'full' | 'mini';
  enrolled?: boolean;
  isCompleted?: boolean;
  onReset?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
  onInfoClick?: () => void;
  index?: number;
  href?: string;
}

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

function normalizeDiff(d?: string) {
  if (!d) return null;
  const s = d.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Thumbnail ─────────────────────────────────────────────────────────
function CourseThumbnail({
  course,
  className,
  textSize = 'text-base',
}: {
  course: CourseCardData;
  className?: string;
  textSize?: string;
}) {
  const img = course.image ?? course.thumbnail;
  const color = course.color ?? 'blue';
  if (img) {
    return (
      <img
        src={img}
        alt={course.title}
        loading='lazy'
        className={cn('w-full h-full object-cover', className)}
      />
    );
  }
  return (
    <div
      className={cn(
        'w-full h-full flex items-center justify-center bg-gradient-to-br border',
        FALLBACK_BG[color] ?? 'from-zinc-900 to-zinc-800 border-zinc-700',
      )}>
      <p
        className={cn(
          'font-black text-center px-3 leading-tight',
          textSize,
          FALLBACK_TEXT[color] ?? 'text-zinc-400',
        )}>
        {course.title}
      </p>
    </div>
  );
}

// ── Reset Confirm Dialog ──────────────────────────────────────────────
function ResetConfirmDialog({
  onReset,
  trigger,
}: {
  onReset: () => void;
  trigger: React.ReactNode;
}) {
  const { t } = useTranslation('courses');
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('detail.resetConfirmTitle', 'Reset course progress?')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              'detail.resetConfirmDesc',
              'This will clear your local progress for this course. Your completion record on the server will remain intact.',
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            className='bg-orange-500 hover:bg-orange-600 text-white'
            onClick={onReset}>
            {t('detail.resetConfirm', 'Yes, Reset')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ═══ FULL VARIANT ════════════════════════════════════════════════════
function FullCard({
  course,
  enrolled,
  isCompleted,
  onReset,
  isFavorite,
  onFavoriteToggle,
  onInfoClick,
  index = 0,
  href,
}: SharedCourseCardProps) {
  const { i18n } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const color = course.color ?? 'blue';
  const comingSoon = course.state === 'COMING_SOON';

  const title =
    lang === 'ar' && course.ar_title ? course.ar_title : course.title;
  const desc =
    lang === 'ar' && course.ar_description
      ? course.ar_description
      : course.description;
  const diff = normalizeDiff(
    lang === 'ar' && course.ar_difficulty
      ? course.ar_difficulty
      : course.difficulty,
  );
  const cat = lang === 'ar' ? course.ar_category : course.category;
  const ct = CONTENT_ICON[course.contentType ?? 'MIXED'];
  const AccessIcon = ACCESS_ICON[course.access ?? 'FREE'] ?? Unlock;
  const destHref =
    href ?? (comingSoon ? '#' : ROUTES.COURSES.DETAIL(course.slug));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group relative flex flex-col rounded-2xl border bg-card overflow-hidden',
        'transition-all duration-300 ring-1 ring-transparent',
        HOVER_RING[color],
        comingSoon ? 'opacity-80' : 'hover:shadow-xl hover:-translate-y-0.5',
      )}>
      {/* ── Thumbnail ── */}
      <div className='relative aspect-video overflow-hidden bg-muted'>
        <CourseThumbnail
          course={course}
          textSize='text-lg'
          className='transition-transform duration-500 group-hover:scale-105'
        />

        {/* Coming Soon overlay */}
        {comingSoon && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
            <span className='flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/80'>
              <Sparkles className='h-3 w-3' /> Coming Soon
            </span>
          </div>
        )}

        {/* Completed overlay — نفس فكرة coming soon بس emerald */}
        {!comingSoon && isCompleted && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]'>
            <span className='flex items-center gap-1.5 rounded-full border border-emerald-500/60 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 shadow-lg'>
              <CheckCircle2 className='h-3.5 w-3.5' /> Completed
            </span>
          </div>
        )}

        {/* Available badge — فقط لو مش coming soon ومش completed */}
        {!comingSoon && !isCompleted && (
          <div className='absolute top-3 start-3'>
            <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md'>
              <span className='h-1.5 w-1.5 rounded-full bg-white' /> Available
            </span>
          </div>
        )}

        {/* Favorite button */}
        {onFavoriteToggle && (
          <button
            onClick={onFavoriteToggle}
            className={cn(
              'absolute top-3 end-3 h-8 w-8 rounded-full flex items-center justify-center',
              'transition-colors shadow-md opacity-0 group-hover:opacity-100',
              isFavorite
                ? 'bg-rose-500 text-white !opacity-100'
                : 'bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-rose-500',
            )}
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }>
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className='flex flex-col flex-1 p-4 gap-3'>
        <div className='flex items-start justify-between gap-2'>
          <h3 className='text-sm font-bold text-foreground leading-snug line-clamp-2 flex-1'>
            {title}
          </h3>
          {cat && (
            <span className='text-[11px] text-muted-foreground shrink-0'>
              {cat}
            </span>
          )}
        </div>

        {desc && (
          <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
            {desc}
          </p>
        )}

        <div className='flex flex-wrap items-center gap-1.5'>
          {diff && (
            <Badge
              variant='outline'
              className='gap-1 text-[10px] font-semibold border-border/60 bg-muted/40'>
              <BarChart3 className='h-3 w-3' /> {diff}
            </Badge>
          )}
          {course.access && (
            <Badge
              variant='outline'
              className={cn(
                'gap-1 text-[10px] font-bold',
                ACCESS_BADGE[course.access],
              )}>
              <AccessIcon className='h-3 w-3' /> {course.access}
            </Badge>
          )}
          {(course.totalTopics ?? 0) > 0 && (
            <Badge
              variant='outline'
              className='gap-1 text-[10px] font-semibold text-primary border-primary/30 bg-primary/5'>
              <Clock className='h-3 w-3' /> {course.totalTopics} Topics
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

        {/* ── CTA Row ── */}
        <div className='flex gap-2 mt-auto pt-1'>
          {onInfoClick && (
            <Button
              variant='outline'
              size='sm'
              className='flex-1 h-9 text-xs border-border/60 hover:bg-muted'
              onClick={onInfoClick}>
              <Info className='h-3.5 w-3.5 me-1.5' /> More Info
            </Button>
          )}

          {/* Completed: Review + Reset */}
          {enrolled && isCompleted ? (
            <div className='flex flex-1 gap-1.5'>
              {/* Review Course — يدخل للكورس عادي */}
              <Button
                size='sm'
                className={cn(
                  'flex-1 h-9 text-xs gap-1.5',
                  'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
                  'hover:bg-emerald-500/20 hover:border-emerald-500/60',
                )}
                variant='outline'
                asChild>
                <Link to={destHref}>
                  <CheckCircle2 className='h-3.5 w-3.5' /> Review
                </Link>
              </Button>

              {/* Reset — icon فقط مع confirm */}
              {onReset && (
                <ResetConfirmDialog
                  onReset={onReset}
                  trigger={
                    <Button
                      size='sm'
                      variant='outline'
                      className={cn(
                        'h-9 w-9 p-0 shrink-0',
                        'border-orange-500/30 bg-orange-500/5 text-orange-400',
                        'hover:bg-orange-500/15 hover:border-orange-500/50',
                      )}>
                      <RotateCcw className='h-3.5 w-3.5' />
                    </Button>
                  }
                />
              )}
            </div>
          ) : (
            /* Not completed: Start / Continue / Coming Soon */
            <Button
              size='sm'
              className='flex-1 h-9 text-xs'
              disabled={comingSoon}
              asChild={!comingSoon}>
              {comingSoon ? (
                <span>Coming Soon</span>
              ) : (
                <Link to={destHref}>
                  {enrolled ? (
                    <>
                      <Zap className='h-3.5 w-3.5 me-1' /> Continue
                    </>
                  ) : (
                    <>
                      Start Learning{' '}
                      <ArrowRight className='h-3.5 w-3.5 ms-1.5' />
                    </>
                  )}
                </Link>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ═══ MINI VARIANT ════════════════════════════════════════════════════
function MiniCard({
  course,
  enrolled,
  isCompleted,
  onReset,
  href,
}: SharedCourseCardProps) {
  const { i18n } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const color = course.color ?? 'blue';
  const comingSoon = course.state === 'COMING_SOON';

  const title =
    lang === 'ar' && course.ar_title ? course.ar_title : course.title;
  const desc =
    lang === 'ar' && course.ar_description
      ? course.ar_description
      : course.description;
  const diff = normalizeDiff(
    lang === 'ar' && course.ar_difficulty
      ? course.ar_difficulty
      : course.difficulty,
  );
  const AccessIcon = ACCESS_ICON[course.access ?? 'FREE'] ?? Unlock;
  const destHref = href ?? ROUTES.COURSES.DETAIL(course.slug);

  const inner = (
    <div
      className={cn(
        'group flex gap-3 rounded-xl border bg-card overflow-hidden transition-all duration-200',
        comingSoon
          ? 'border-border/30 opacity-60 cursor-not-allowed'
          : cn(
              'border-border/50 cursor-pointer hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm',
              HOVER_RING[color],
            ),
      )}>
      {/* Thumbnail */}
      <div className='relative h-24 w-36 shrink-0 overflow-hidden bg-muted'>
        <CourseThumbnail course={course} textSize='text-xs' />
        {comingSoon && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
            <Sparkles className='h-4 w-4 text-white/70' />
          </div>
        )}
        {/* Completed indicator على الـ mini thumbnail */}
        {!comingSoon && isCompleted && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
            <CheckCircle2 className='h-5 w-5 text-emerald-400' />
          </div>
        )}
      </div>

      {/* Text */}
      <div className='flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-3 pe-3'>
        <h4 className='line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary'>
          {title}
        </h4>
        {desc && (
          <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
            {desc}
          </p>
        )}
        <div className='flex flex-wrap items-center gap-1.5'>
          {diff && (
            <Badge
              variant='outline'
              className='gap-1 text-[10px] font-semibold border-border/60 bg-muted/40'>
              <BarChart3 className='h-3 w-3' /> {diff}
            </Badge>
          )}
          {course.access && (
            <Badge
              variant='outline'
              className={cn(
                'gap-1 text-[10px] font-bold',
                ACCESS_BADGE[course.access],
              )}>
              <AccessIcon className='h-3 w-3' /> {course.access}
            </Badge>
          )}
        </div>
      </div>

      {/* State icon */}
      <div className='flex shrink-0 items-center pe-3'>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border transition-all',
            comingSoon
              ? 'border-border/30 text-muted-foreground/30'
              : enrolled && isCompleted
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : enrolled
                  ? 'border-border/50 bg-muted/50 text-muted-foreground group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary'
                  : 'border-border/50 bg-muted/50 text-muted-foreground group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary',
          )}>
          {enrolled && isCompleted ? (
            <CheckCircle2 className='h-3.5 w-3.5' />
          ) : enrolled ? (
            <Zap className='h-3.5 w-3.5' />
          ) : (
            <ArrowRight className='h-3.5 w-3.5' />
          )}
        </div>
      </div>
    </div>
  );

  if (comingSoon) return inner;

  // Mini completed → يدخل للكورس للـ review (لا يفتح reset dialog)
  return (
    <Link to={destHref} className='block'>
      {inner}
    </Link>
  );
}

// ═══ EXPORT ══════════════════════════════════════════════════════════
export function SharedCourseCard(props: SharedCourseCardProps) {
  return props.variant === 'mini' ? (
    <MiniCard {...props} />
  ) : (
    <FullCard {...props} />
  );
}
