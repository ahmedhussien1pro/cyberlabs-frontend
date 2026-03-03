import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  BookOpen,
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { MatrixRain } from '@/shared/components/common/landing/matrix-rain';
import { ROUTES } from '@/shared/constants';
import type { Course } from '../types/course.types';

const ACCESS_BADGE: Record<string, string> = {
  FREE: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  PRO: 'border-blue-500/40    text-blue-400    bg-blue-500/10',
  PREMIUM: 'border-violet-500/40  text-violet-400  bg-violet-500/10',
};
const GLOW: Record<string, string> = {
  emerald: 'shadow-emerald-500/15',
  blue: 'shadow-blue-500/15',
  violet: 'shadow-violet-500/15',
  orange: 'shadow-orange-500/15',
  rose: 'shadow-rose-500/15',
  cyan: 'shadow-cyan-500/15',
};
const FALLBACK_BG: Record<string, string> = {
  emerald: 'from-emerald-950 to-emerald-900',
  blue: 'from-blue-950 to-blue-900',
  violet: 'from-violet-950 to-violet-900',
  orange: 'from-orange-950 to-orange-900',
  rose: 'from-rose-950 to-rose-900',
  cyan: 'from-cyan-950 to-cyan-900',
};
const FALLBACK_TEXT: Record<string, string> = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  violet: 'text-violet-400',
  orange: 'text-orange-400',
  rose: 'text-rose-400',
  cyan: 'text-cyan-400',
};

export interface CourseDetailHeroProps {
  course: Course;
  enrolled: boolean;
  enrolling: boolean;
  progress: number;
  done: number;
  fav: boolean;
  onEnroll: () => void;
  onToggleFav: () => void;
  onReset?: () => void; // ✅
  onContinue?: () => void; // ✅ scroll للأول topic
}

export function CourseDetailHero({
  course,
  enrolled,
  enrolling,
  progress,
  done,
  fav,
  onEnroll,
  onToggleFav,
  onReset,
  onContinue,
}: CourseDetailHeroProps) {
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const title = lang === 'ar' ? course.ar_title : course.title;
  const desc = lang === 'ar' ? course.ar_description : course.description;
  const diff = lang === 'ar' ? course.ar_difficulty : course.difficulty;
  const skills = lang === 'ar' ? course.ar_skills : course.skills;
  const prereqs =
    lang === 'ar' ? course.ar_prerequisites : course.prerequisites;
  const topics = lang === 'ar' ? course.ar_topics : course.topics;
  const comingSoon = course.state === 'COMING_SOON';
  const hasTopics = topics.length > 0;
  const imgSrc = course.image ?? course.thumbnail;

  // ✅ 3 حالات: غير مسجّل / مسجّل ناقص / مسجّل مكتمل
  const isCompleted = enrolled && progress >= 100;

  return (
    <div className='relative overflow-hidden border-b border-border/50'>
      <div className='absolute inset-0 bg-background' />
      <div className='absolute inset-0 bg-gradient-to-b from-muted/80 via-muted/30 to-transparent dark:from-zinc-950 dark:via-zinc-900/50 dark:to-transparent' />
      <MatrixRain className='absolute inset-0 opacity-[0.03] dark:opacity-[0.06]' />

      <div className='relative z-10 container mx-auto px-4 py-6'>
        <div
          className={cn(
            'gap-6 items-stretch',
            hasTopics ? 'grid lg:grid-cols-[1fr_260px]' : 'flex flex-col',
          )}>
          <div className='flex flex-col gap-5 min-w-0'>
            <div className='space-y-3.5 flex-1'>
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-2'>
                <Badge
                  variant='outline'
                  className={cn(
                    'text-xs font-bold gap-1.5',
                    ACCESS_BADGE[course.access],
                  )}>
                  {course.access === 'FREE' ? (
                    <Unlock className='h-3 w-3' />
                  ) : (
                    <Crown className='h-3 w-3' />
                  )}
                  {course.access}
                </Badge>
                <Badge variant='secondary' className='text-xs'>
                  {lang === 'ar' ? course.ar_category : course.category}
                </Badge>
                <Badge variant='secondary' className='text-xs gap-1'>
                  <Shield className='h-3 w-3' /> {diff}
                </Badge>
                {course.isNew && (
                  <Badge className='text-xs bg-primary text-primary-foreground'>
                    NEW
                  </Badge>
                )}
                {comingSoon && (
                  <Badge
                    variant='outline'
                    className='text-xs border-zinc-500/40 text-zinc-500'>
                    Coming Soon
                  </Badge>
                )}
                {/* ✅ Completed badge */}
                {isCompleted && (
                  <Badge className='text-xs gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-400'>
                    <CheckCircle2 className='h-3 w-3' />
                    {t('detail.completed', 'Completed')}
                  </Badge>
                )}
              </div>

              <h1 className='text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight'>
                {title}
              </h1>
              <p className='text-foreground/70 text-[15px] leading-relaxed'>
                {desc}
              </p>

              {/* Stats */}
              <div className='flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/60'>
                <span className='flex items-center gap-1.5'>
                  <BookOpen className='h-4 w-4 text-primary/80' />
                  <strong className='text-foreground/80 font-semibold'>
                    {course.totalTopics}
                  </strong>{' '}
                  {t('detail.topics', 'Topics')}
                </span>
                <span className='flex items-center gap-1.5'>
                  <Clock className='h-4 w-4 text-primary/80' />
                  <strong className='text-foreground/80 font-semibold'>
                    {course.estimatedHours}h
                  </strong>
                </span>
                <span className='flex items-center gap-1.5'>
                  <FlaskConical className='h-4 w-4 text-primary/80' />
                  <span className='text-foreground/70'>
                    {t('detail.labsIncluded', 'Labs included')}
                  </span>
                </span>
                {(course.enrollmentCount ?? 0) > 0 && (
                  <span className='flex items-center gap-1.5'>
                    <Users className='h-4 w-4 text-primary/80' />
                    <strong className='text-foreground/80 font-semibold'>
                      {course.enrollmentCount.toLocaleString()}
                    </strong>
                  </span>
                )}
                {(course.averageRating ?? 0) > 0 && (
                  <span className='flex items-center gap-1.5'>
                    <Star className='h-4 w-4 fill-yellow-500 text-yellow-500' />
                    <strong className='text-foreground/80 font-semibold'>
                      {course.averageRating}
                    </strong>
                    <span className='text-foreground/40'>
                      ({course.reviewCount})
                    </span>
                  </span>
                )}
                <Link
                  to={ROUTES.COURSES.LIST}
                  className='flex items-center gap-1.5 text-sm font-medium h-4 w-36 text-primary hover:text-foreground transition-colors'>
                  <ChevronLeft className='h-4 w-4 rtl:rotate-180' />
                  {t('detail.backToList', 'All Courses')}
                </Link>
              </div>

              {enrolled && !hasTopics && course.totalTopics > 0 && (
                <div className='max-w-xs space-y-1.5'>
                  <div className='flex justify-between text-xs text-foreground/60'>
                    <span>
                      {done}/{course.totalTopics} {t('detail.done', 'done')}
                    </span>
                    <span
                      className={cn(
                        'font-bold',
                        isCompleted ? 'text-emerald-400' : 'text-primary',
                      )}>
                      {progress}%
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className={cn(
                      'h-1.5',
                      isCompleted && '[&>div]:bg-emerald-500',
                    )}
                  />
                </div>
              )}
            </div>

            {/* CTA Box */}
            <div
              className={cn(
                'rounded-2xl border border-border/60 bg-card overflow-hidden',
                'shadow-lg ring-1 ring-border/20 flex flex-col sm:flex-row',
                GLOW[course.color] && `shadow-xl ${GLOW[course.color]}`,
              )}>
              {/* Thumbnail */}
              <div className='sm:w-48 h-40 sm:h-auto shrink-0 overflow-hidden bg-muted'>
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={title ?? ''}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div
                    className={cn(
                      'w-full h-full flex items-center justify-center bg-gradient-to-br',
                      FALLBACK_BG[course.color] ?? 'from-zinc-900 to-zinc-800',
                    )}>
                    <p
                      className={cn(
                        'text-base font-black text-center px-3 leading-tight',
                        FALLBACK_TEXT[course.color] ?? 'text-zinc-400',
                      )}>
                      {title}
                    </p>
                  </div>
                )}
              </div>

              {/* Skills + prereqs + CTA */}
              <div className='flex-1 p-4 flex flex-col sm:flex-row gap-4 min-w-0'>
                <div className='flex-1 min-w-0 flex flex-col gap-2.5 justify-center'>
                  {skills.length > 0 && (
                    <div>
                      <p className='text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-1.5'>
                        {t('detail.skillsLabel', "Skills you'll gain")}
                      </p>
                      <div className='flex flex-wrap gap-1'>
                        {skills.slice(0, 5).map((s, i) => (
                          <span
                            key={i}
                            className='text-xs px-2 py-0.5 rounded-full border border-border/40 bg-muted/50 text-foreground/60'>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {prereqs.length > 0 && (
                    <div>
                      <p className='text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-1.5'>
                        {t('detail.prereqLabel', 'Prerequisites')}
                      </p>
                      <ul className='flex flex-wrap gap-x-4 gap-y-1'>
                        {prereqs.map((p, i) => (
                          <li
                            key={i}
                            className='flex items-center gap-1.5 text-xs text-foreground/55'>
                            <CheckCircle2 className='h-3 w-3 text-muted-foreground shrink-0' />{' '}
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* ✅ CTA — 3 حالات واضحة */}
                <div className='flex flex-row sm:flex-col gap-2 sm:w-44 shrink-0 sm:justify-center'>
                  {enrolled ? (
                    isCompleted ? (
                      /* ✅ حالة 3: مكتمل → Reset بلون برتقالي + AlertDialog */
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant='outline'
                            className={cn(
                              'sm:flex-none sm:w-full gap-2',
                              'border-orange-500/40 bg-orange-500/5 text-orange-400',
                              'hover:bg-orange-500/15 hover:border-orange-500/60',
                            )}>
                            <RotateCcw className='h-4 w-4' />
                            {t('detail.resetProgress', 'Reset Progress')}
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
                                'Your completed topics will be cleared locally. You can start fresh from the beginning.',
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
                    ) : (
                      /* ✅ حالة 2: مسجّل ناقص → Continue Learning يعمل scroll */
                      <Button
                        className='sm:flex-none sm:w-full'
                        onClick={onContinue}>
                        <Zap className='h-4 w-4 me-2' />
                        {t('detail.continueLearning', 'Continue Learning')}
                      </Button>
                    )
                  ) : course.access === 'FREE' ? (
                    /* حالة 1a: غير مسجّل FREE */
                    <Button
                      className='sm:flex-none sm:w-full'
                      onClick={onEnroll}
                      disabled={enrolling || comingSoon}>
                      {enrolling ? (
                        <>
                          <Loader2 className='h-4 w-4 me-2 animate-spin' />
                          {t('detail.enrolling', 'Enrolling...')}
                        </>
                      ) : (
                        <>
                          <Rocket className='h-4 w-4 me-2' />
                          {t('detail.startFree', 'Start for Free')}
                        </>
                      )}
                    </Button>
                  ) : (
                    /* حالة 1b: غير مسجّل PRO/PREMIUM */
                    <Button
                      className='flex-1 sm:flex-none sm:w-full'
                      onClick={onEnroll}
                      disabled={comingSoon}>
                      <Crown className='h-4 w-4 me-2' />
                      {t('detail.upgrade', 'Upgrade to {{plan}}', {
                        plan: course.access,
                      })}
                    </Button>
                  )}

                  {/* Favorite — ثابت */}
                  <button
                    onClick={onToggleFav}
                    className={cn(
                      'sm:flex-none sm:w-full flex items-center justify-center gap-2',
                      'rounded border py-2 px-3 text-xs font-medium transition-all',
                      fav
                        ? 'border-rose-500/50 bg-rose-500/10 text-rose-500 hover:bg-rose-500/15'
                        : 'border-border/60 text-foreground/60 hover:border-rose-500/30 hover:text-rose-500',
                    )}>
                    <Heart
                      className={cn('h-4 w-4 shrink-0', fav && 'fill-current')}
                    />
                    <span className='truncate'>
                      {fav
                        ? t('detail.removeFav', 'Remove from Favorites')
                        : t('detail.addFav', 'Add to Favorites')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Topics sidebar */}
          {hasTopics && (
            <div className='rounded-xl border border-border/40 bg-muted/20 dark:bg-white/[0.03] p-4 flex flex-col gap-3 self-stretch'>
              {enrolled && course.totalTopics > 0 ? (
                <div className='space-y-1.5 pb-3 border-b border-border/30'>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-foreground/55'>
                      {done}/{course.totalTopics} {t('detail.done', 'done')}
                    </span>
                    <span
                      className={cn(
                        'font-bold text-sm',
                        isCompleted ? 'text-emerald-400' : 'text-primary',
                      )}>
                      {progress}%
                      {isCompleted && (
                        <CheckCircle2 className='inline h-3.5 w-3.5 ms-1' />
                      )}
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className={cn(
                      'h-1.5',
                      isCompleted && '[&>div]:bg-emerald-500',
                    )}
                  />
                </div>
              ) : (
                <div className='pb-2 border-b border-border/30'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-foreground/40'>
                    {t('detail.willLearn', "What you'll learn")}
                  </p>
                </div>
              )}
              {enrolled && (
                <p className='text-[10px] font-bold uppercase tracking-widest text-foreground/35 -mb-1'>
                  {t('detail.willLearn', "What you'll learn")}
                </p>
              )}
              <div className='flex flex-col gap-1.5 flex-1'>
                {topics.map((topic, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-2.5 rounded-lg bg-background/60 dark:bg-white/[0.04] border border-border/30 px-3 py-2 text-xs text-foreground/75 hover:border-primary/30 hover:text-foreground transition-colors duration-150 cursor-default'>
                    <Zap className='h-3.5 w-3.5 shrink-0 text-primary' />
                    <span className='leading-snug'>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
