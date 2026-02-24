// src/features/courses/pages/course-detail-page.tsx
import { useParams, Link, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import MainLayout from '@/shared/components/layout/main-layout';
import { CourseCurriculum } from '../components/course-curriculum';
import { useCourse } from '../hooks/use-course';
import { useEnrollment } from '../hooks/use-enrollment';
import { useCourseProgressStore } from '../store/course-progress.store';
import { MatrixRain } from '@/shared/components/common/landing/matrix-rain';
import { ROUTES } from '@/shared/constants';

// ── Color maps ─────────────────────────────────────────────────────────
const ACCESS_BADGE: Record<string, string> = {
  free: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  pro: 'border-blue-500/40    text-blue-400    bg-blue-500/10',
  premium: 'border-violet-500/40  text-violet-400  bg-violet-500/10',
};
const COLOR_GLOW: Record<string, string> = {
  emerald: 'shadow-emerald-500/20',
  blue: 'shadow-blue-500/20',
  violet: 'shadow-violet-500/20',
  orange: 'shadow-orange-500/20',
  rose: 'shadow-rose-500/20',
  cyan: 'shadow-cyan-500/20',
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

export default function CourseDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation('courses');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();

  const { data: course, isLoading, isError } = useCourse(slug);
  const { mutate: enroll, isPending: enrolling } = useEnrollment();
  const {
    isEnrolled,
    getProgress,
    getCompletedCount,
    toggleFavorite,
    isFavorite,
  } = useCourseProgressStore();

  if (isLoading)
    return (
      <MainLayout>
        <CourseDetailSkeleton />
      </MainLayout>
    );

  if (isError || !course) {
    return (
      <MainLayout>
        <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
          <Shield className='h-12 w-12 text-muted-foreground' />
          <p className='font-semibold'>
            {t('detail.notFound', 'Course not found')}
          </p>
          <Link to={ROUTES.COURSES.LIST}>
            <Button variant='outline' size='sm'>
              <ChevronLeft className='h-4 w-4 me-1 rtl:rotate-180' />
              {t('detail.backToList', 'All Courses')}
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course.id, course.totalTopics);
  const done = getCompletedCount(course.id);
  const fav = isFavorite(course.id);
  const title = lang === 'ar' ? course.ar_title : course.title;
  const desc = lang === 'ar' ? course.ar_description : course.description;
  const longDesc =
    lang === 'ar' ? course.ar_longDescription : course.longDescription;
  const diff = lang === 'ar' ? course.ar_difficulty : course.difficulty;
  const skills = lang === 'ar' ? course.ar_skills : course.skills;
  const prereqs =
    lang === 'ar' ? course.ar_prerequisites : course.prerequisites;
  const topics = lang === 'ar' ? course.ar_topics : course.topics;
  const comingSoon = course.status === 'coming_soon';

  const handleEnroll = () => {
    if (course.access !== 'free') {
      navigate(ROUTES.PRICING ?? '/pricing');
      return;
    }
    enroll({ courseId: course.id, access: course.access });
  };

  return (
    <MainLayout>
      <div className='min-h-screen bg-background'>
        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <div className='relative overflow-hidden border-b border-border/50'>
          <MatrixRain className='absolute inset-0 opacity-[0.08]' />

          {/* Back link */}
          <div className='relative z-10 container mx-auto px-4 pt-5'>
            <Link
              to={ROUTES.COURSES.LIST}
              className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'>
              <ChevronLeft className='h-4 w-4 rtl:rotate-180' />
              {t('detail.backToList', 'All Courses')}
            </Link>
          </div>

          <div
            className='relative z-10 container mx-auto px-4 py-10
                          grid lg:grid-cols-[1fr_340px] gap-10 items-start'>
            {/* ── Left ───────────────────────────────── */}
            <div className='space-y-5'>
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-2'>
                <Badge
                  variant='outline'
                  className={cn(
                    'text-xs font-bold',
                    ACCESS_BADGE[course.access],
                  )}>
                  {course.access.toUpperCase()}
                </Badge>
                <Badge variant='secondary' className='text-xs'>
                  {lang === 'ar' ? course.ar_category : course.category}
                </Badge>
                <Badge variant='secondary' className='text-xs'>
                  {diff}
                </Badge>
                {course.isNew && (
                  <Badge className='text-xs bg-primary text-primary-foreground'>
                    NEW
                  </Badge>
                )}
                {comingSoon && (
                  <Badge
                    variant='outline'
                    className='text-xs border-zinc-500/40 text-zinc-400'>
                    Coming Soon
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className='text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight'>
                {title}
              </h1>

              {/* Description */}
              <p className='text-muted-foreground text-base leading-relaxed max-w-xl'>
                {desc}
              </p>

              {/* Stats row */}
              <div className='flex flex-wrap gap-4 text-sm'>
                <span className='flex items-center gap-1.5 text-muted-foreground'>
                  <BookOpen className='h-4 w-4' />
                  {course.totalTopics} {t('detail.topics', 'Topics')}
                </span>
                <span className='flex items-center gap-1.5 text-muted-foreground'>
                  <Clock className='h-4 w-4' />
                  {course.estimatedHours}h
                </span>
                {course.enrolledCount > 0 && (
                  <span className='flex items-center gap-1.5 text-muted-foreground'>
                    <Users className='h-4 w-4' />
                    {course.enrolledCount.toLocaleString()}
                  </span>
                )}
                {course.rating > 0 && (
                  <span className='flex items-center gap-1.5 text-yellow-500'>
                    <Star className='h-4 w-4 fill-yellow-500' />
                    {course.rating} ({course.reviewCount})
                  </span>
                )}
              </div>

              {/* Progress bar (enrolled only) */}
              {enrolled && course.totalTopics > 0 && (
                <div className='max-w-xs space-y-1.5'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground'>
                      {done}/{course.totalTopics} {t('detail.done', 'done')}
                    </span>
                    <span className='text-primary font-bold'>{progress}%</span>
                  </div>
                  <div className='h-2 rounded-full bg-muted overflow-hidden'>
                    <div
                      className='h-full bg-primary rounded-full transition-all duration-500'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* What you'll learn chips */}
              {topics.length > 0 && (
                <div className='grid sm:grid-cols-2 gap-2 pt-1'>
                  {topics.map((topic, i) => (
                    <div
                      key={i}
                      className='flex items-start gap-2 text-sm text-foreground/80'>
                      <Zap className='h-4 w-4 mt-0.5 shrink-0 text-primary' />
                      {topic}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: CTA card ─────────────────────── */}
            <div
              className={cn(
                'rounded-2xl border border-border/60 bg-card overflow-hidden',
                'shadow-xl ring-1 ring-border/20',
                COLOR_GLOW[course.color] &&
                  `shadow-2xl ${COLOR_GLOW[course.color]}`,
              )}>
              {/* Thumbnail */}
              <div className='aspect-video overflow-hidden bg-muted'>
                {course.image ? (
                  <img
                    src={course.image}
                    alt={title}
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
                        'text-xl font-black text-center px-6 leading-tight',
                        FALLBACK_TEXT[course.color] ?? 'text-zinc-400',
                      )}>
                      {title}
                    </p>
                  </div>
                )}
              </div>

              <div className='p-5 space-y-4'>
                {/* CTA Button */}
                {enrolled ? (
                  <Button className='w-full' size='lg'>
                    <Zap className='h-4 w-4 me-2' />
                    {t('detail.continueLearning', 'Continue Learning')}
                  </Button>
                ) : course.access === 'free' ? (
                  <Button
                    className='w-full'
                    size='lg'
                    onClick={handleEnroll}
                    disabled={enrolling || comingSoon}>
                    {enrolling ? (
                      <span className='animate-pulse'>
                        {t('detail.enrolling', 'Enrolling...')}
                      </span>
                    ) : (
                      t('detail.startFree', 'Start for Free 🚀')
                    )}
                  </Button>
                ) : (
                  <Button
                    className='w-full'
                    size='lg'
                    onClick={handleEnroll}
                    disabled={comingSoon}>
                    {t('detail.upgrade', 'Upgrade to {{plan}}', {
                      plan: course.access.toUpperCase(),
                    })}
                  </Button>
                )}

                {/* Favorite toggle */}
                <button
                  onClick={() => toggleFavorite(course.id)}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all',
                    fav
                      ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
                      : 'border-border/60 text-muted-foreground hover:border-rose-500/30 hover:text-rose-500',
                  )}>
                  <span>{fav ? '❤️' : '🤍'}</span>
                  {fav
                    ? t('detail.savedFav', 'Saved to Favorites')
                    : t('detail.addFav', 'Add to Favorites')}
                </button>

                {/* Quick stats grid */}
                <div className='grid grid-cols-2 gap-2 pt-1'>
                  {[
                    {
                      icon: <BookOpen className='h-3.5 w-3.5' />,
                      label: `${course.totalTopics} topics`,
                    },
                    {
                      icon: <Clock className='h-3.5 w-3.5' />,
                      label: `${course.estimatedHours}h total`,
                    },
                    {
                      icon: <FlaskConical className='h-3.5 w-3.5' />,
                      label: t('detail.labsIncluded', 'Labs included'),
                    },
                    { icon: <Shield className='h-3.5 w-3.5' />, label: diff },
                  ].map(({ icon, label }, i) => (
                    <div
                      key={i}
                      className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      {icon} {label}
                    </div>
                  ))}
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                  <div>
                    <p className='text-xs font-semibold text-muted-foreground/70 mb-2'>
                      {t('detail.skillsLabel', "Skills you'll gain")}
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className='text-xs px-2 py-0.5 rounded-full border border-border/40 bg-muted/40 text-muted-foreground'>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {prereqs.length > 0 && (
                  <div>
                    <p className='text-xs font-semibold text-muted-foreground/70 mb-2'>
                      {t('detail.prereqLabel', 'Prerequisites')}
                    </p>
                    <ul className='space-y-1'>
                      {prereqs.map((p, i) => (
                        <li
                          key={i}
                          className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                          <span className='h-1 w-1 rounded-full bg-muted-foreground shrink-0' />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            CURRICULUM
        ══════════════════════════════════════════════ */}
        <div className='container mx-auto px-4 py-10'>
          {/* Long description */}
          {longDesc && (
            <div className='mb-8 p-5 rounded-xl border border-border/40 bg-muted/20'>
              <p className='text-sm text-foreground/80 leading-7'>{longDesc}</p>
            </div>
          )}

          {course.sections.length > 0 ? (
            <CourseCurriculum course={course} isEnrolled={enrolled} />
          ) : (
            <div className='flex flex-col items-center justify-center py-20 gap-3 text-center'>
              <Clock className='h-10 w-10 text-muted-foreground' />
              <p className='font-semibold text-foreground'>
                {t('curriculum.empty', 'Curriculum coming soon')}
              </p>
              <p className='text-sm text-muted-foreground'>
                {t('curriculum.emptyHint', 'Check back later for updates.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────
function CourseDetailSkeleton() {
  return (
    <div className='container mx-auto px-4 py-10'>
      <Skeleton className='h-4 w-28 mb-8' />
      <div className='grid lg:grid-cols-[1fr_340px] gap-10'>
        <div className='space-y-4'>
          <div className='flex gap-2'>
            <Skeleton className='h-6 w-16 rounded-full' />
            <Skeleton className='h-6 w-20 rounded-full' />
          </div>
          <Skeleton className='h-12 w-3/4' />
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-5/6' />
          <div className='grid sm:grid-cols-2 gap-2 pt-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-5 w-full' />
            ))}
          </div>
        </div>
        <div className='rounded-2xl border border-border/40 overflow-hidden'>
          <Skeleton className='aspect-video w-full' />
          <div className='p-5 space-y-3'>
            <Skeleton className='h-11 w-full rounded-xl' />
            <Skeleton className='h-9 w-full rounded-xl' />
            <div className='grid grid-cols-2 gap-2 pt-2'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-4 w-full' />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
