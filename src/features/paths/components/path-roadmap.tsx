import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Lock,
  Sparkles,
  BarChart3,
  Trophy,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/shared/constants';
import { SharedCourseCard } from '@/shared/components/shared-course-card';
import type { CourseCardData } from '@/shared/components/shared-course-card';
import type { PathModule, ModuleType } from '../types/path.types';
import { useCourseProgressStore } from '@/features/courses/store/course-progress.store';

type ModuleState = 'done' | 'active' | 'locked' | 'soon';

function getModuleState(mod: PathModule, completedIds: string[]): ModuleState {
  if (completedIds.includes(mod.id) || mod.userProgress?.isCompleted)
    return 'done';
  if (mod.status === 'coming_soon') return 'soon';
  if (mod.isLocked) return 'locked';
  return 'active';
}
function resolveHref(mod: PathModule): string | undefined {
  if (!mod.slug) return undefined;
  if (mod.type === 'course') return ROUTES.COURSES.DETAIL(mod.slug);
  if (mod.type === 'lab') return ROUTES.LABS.DETAIL(mod.slug);
  return undefined;
}
function toCardData(mod: PathModule): CourseCardData {
  const c = mod.course as any;
  return {
    id: mod.id,
    slug: mod.slug ?? c?.slug ?? '',
    title: mod.title || c?.title || '',
    ar_title: mod.ar_title || c?.ar_title,
    description: mod.description || c?.description,
    ar_description: mod.ar_description || c?.ar_description,
    thumbnail: c?.thumbnail,
    color: ((c?.color as string | undefined) ?? 'blue').toLowerCase(),
    difficulty: c?.difficulty,
    access: c?.access ?? 'FREE',
    contentType: c?.contentType,
    totalTopics: c?.totalTopics,
    estimatedHours: mod.estimatedHours ?? c?.duration,
    state: mod.status === 'coming_soon' ? 'COMING_SOON' : 'PUBLISHED',
  };
}

const STATE_TOP_BORDER: Record<ModuleState, string> = {
  done: 'border-t-emerald-500',
  active: 'border-t-primary',
  locked: 'border-t-border/30',
  soon: 'border-t-border/20',
};
const STATE_BADGE: Record<ModuleState, string> = {
  done: 'border-emerald-500 bg-background text-emerald-500',
  active: 'border-primary   bg-background text-primary',
  locked: 'border-border    bg-muted      text-muted-foreground/60',
  soon: 'border-border/50 bg-muted/60   text-muted-foreground/40',
};
const TYPE_LABEL: Record<ModuleType, string> = {
  course: 'detail.course',
  lab: 'detail.lab',
  quiz: 'detail.quiz',
  project: 'detail.project',
};

interface PathRoadmapProps {
  modules: PathModule[];
  completedIds?: string[];
}

export function PathRoadmap({ modules, completedIds = [] }: PathRoadmapProps) {
  const { t, i18n } = useTranslation('paths');
  const isAr = i18n.language === 'ar';
  const { isEnrolled, resetProgress } = useCourseProgressStore();

  const doneCount = modules.filter(
    (m) => completedIds.includes(m.id) || !!m.userProgress?.isCompleted,
  ).length;
  const totalCount = modules.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const totalHours = modules.reduce((s, m) => s + (m.estimatedHours ?? 0), 0);

  return (
    <section className='container mx-auto px-4 py-10'>
      {/* Progress Header */}
      <div className='mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            {t('detail.pathRoadmap')}
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {totalCount} {t('detail.followOrderSuffix')}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-2.5 rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5'>
            <BarChart3 className='h-4 w-4 text-primary' />
            <div>
              <p className='text-[11px] text-muted-foreground leading-none mb-0.5'>
                {t('detail.yourProgress')}
              </p>
              <div className='flex items-center gap-2'>
                <Progress value={pct} className='h-1.5 w-20 bg-muted' />
                <span className='text-sm font-black text-foreground leading-none'>
                  {pct}%
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5'>
            <Clock className='h-4 w-4 text-primary' />
            <div>
              <p className='text-[11px] text-muted-foreground leading-none mb-0.5'>
                {t('detail.estTime')}
              </p>
              <p className='text-sm font-black text-foreground leading-none'>
                {totalHours}h
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5'>
            <Trophy className='h-4 w-4 text-amber-400' />
            <div>
              <p className='text-[11px] text-muted-foreground leading-none mb-0.5'>
                Completed
              </p>
              <p className='text-sm font-black text-foreground leading-none'>
                {doneCount}/{totalCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3'>
        {modules.map((mod, idx) => {
          const state = getModuleState(mod, completedIds);
          const cardData = toCardData(mod);
          const href = resolveHref(mod);
          const isInteractive = state !== 'locked' && state !== 'soon';

          const courseId = (mod.course as any)?.id ?? '';
          // const courseTopics = (mod.course as any)?.totalTopics ?? 0;

          // ✅ enrolled: من الـ store الحقيقي
          const enrolledInCourse =
            (courseId && isEnrolled(courseId)) ||
            !!mod.userProgress?.isCompleted;

          // ✅ isCompleted: store أو backend
          const courseComplete =
            !!mod.userProgress?.isCompleted ||
            (mod.userProgress?.progress ?? 0) >= 100;

          // ✅ onReset: يمسح local store
          const handleReset = courseId
            ? () => resetProgress(courseId)
            : undefined;

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.07 }}
              className='relative pt-4'>
              {/* Step badge */}
              <div
                className={cn(
                  'absolute top-0.5 start-4 z-20',
                  'flex h-8 w-8 items-center justify-center',
                  'rounded-full border-2 shadow-sm text-xs font-black',
                  STATE_BADGE[state],
                )}>
                {state === 'done' ? (
                  <CheckCircle2 className='h-4 w-4' />
                ) : state === 'locked' ? (
                  <Lock className='h-3.5 w-3.5' />
                ) : state === 'soon' ? (
                  <Sparkles className='h-3.5 w-3.5' />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Type label */}
              <div
                className={cn(
                  'absolute top-1 end-4 z-20',
                  'rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                  !isInteractive
                    ? 'border-border/30 bg-muted/60 text-muted-foreground/40'
                    : 'border-border/50 bg-background/80 text-muted-foreground',
                )}>
                {t(TYPE_LABEL[mod.type] ?? TYPE_LABEL.course)}
              </div>

              {/* Card wrapper */}
              <div
                className={cn(
                  'relative rounded-2xl border-t-[3px] overflow-hidden',
                  'ring-1 ring-transparent transition-all duration-300',
                  STATE_TOP_BORDER[state],
                  state === 'done' && 'ring-emerald-500/20',
                  state === 'active' && 'ring-primary/15',
                  !isInteractive && 'opacity-65',
                )}>
                {state === 'locked' && (
                  <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-background/75 backdrop-blur-[3px]'>
                    <Lock className='h-9 w-9 text-muted-foreground/40' />
                    <p className='text-xs text-muted-foreground/70 px-4 text-center'>
                      Complete previous modules to unlock
                    </p>
                  </div>
                )}

                <SharedCourseCard
                  course={cardData}
                  variant='full'
                  href={href}
                  enrolled={enrolledInCourse}
                  isCompleted={courseComplete} // ✅
                  onReset={handleReset} // ✅
                  index={idx}
                />
              </div>

              {idx < modules.length - 1 && (
                <div className='absolute -bottom-5 start-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 sm:hidden'>
                  <div className='h-3 w-px bg-border/40' />
                  <div className='h-2 w-2 rounded-full border border-border/40 bg-muted' />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {pct === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className='mt-10 flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-400'>
          <Trophy className='h-6 w-6' />
          <div>
            <p className='font-bold'>Path Complete! 🎉</p>
            <p className='text-sm text-emerald-500/70'>
              You've completed all modules in this path.
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
}
