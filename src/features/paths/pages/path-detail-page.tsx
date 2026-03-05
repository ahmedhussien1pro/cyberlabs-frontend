import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

import { PathDetailHero } from '../components/path-detail-hero';
import { PathRoadmap } from '../components/path-roadmap';
import { PathCardSkeleton } from '../components/path-card-skeleton';
import { usePath } from '../hooks/use-paths';
import { useUserProgress } from '@/features/courses/hooks/use-user-progress';
import { ROUTES } from '@/shared/constants';
import MainLayout from '@/shared/components/layout/main-layout';

export default function PathDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('paths');
  const { data: path, isLoading, isError } = usePath(slug ?? '');

  const { isCompleted: isCourseCompleted } = useUserProgress();

  const roadmapRef = useRef<HTMLElement>(null);

  const completedIds =
    path?.modules
      .filter((m) => {
        const courseId = m.course?.id ?? '';
        if (courseId) return isCourseCompleted(courseId);
        return !!m.userProgress?.isCompleted;
      })
      .map((m) => m.id) ?? [];

  const firstActiveModuleId =
    path?.modules.find((m) => {
      const courseId = m.course?.id ?? '';
      const done = courseId
        ? isCourseCompleted(courseId)
        : !!m.userProgress?.isCompleted;
      return !m.isLocked && m.status !== 'coming_soon' && !done;
    })?.id ?? null;

  const handleStartPath = () => {
    if (!roadmapRef.current) return;

    if (firstActiveModuleId) {
      const el = document.getElementById(`module-${firstActiveModuleId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        setTimeout(
          () => el.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'),
          2000,
        );
        return;
      }
    }

    roadmapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <MainLayout>
      <div className='min-h-screen bg-background'>
        {isLoading && (
          <div className='container mx-auto grid grid-cols-1 gap-6 px-4 py-12 lg:grid-cols-3'>
            {Array.from({ length: 7 }).map((_, i) => (
              <PathCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && (isError || !path) && (
          <div className='flex flex-col items-center justify-center gap-4 py-32'>
            <p className='text-muted-foreground'>{t('detail.notFound')}</p>
            <Link
              to={ROUTES.PATHS.LIST}
              className='flex items-center gap-1.5 text-sm text-primary hover:underline'>
              <ArrowLeft className='h-3.5 w-3.5' />
              {t('detail.backToPaths')}
            </Link>
          </div>
        )}

        {!isLoading && path && (
          <>
            <PathDetailHero path={path} onStartPath={handleStartPath} />
            <PathRoadmap
              modules={path.modules}
              completedIds={completedIds}
              sectionRef={roadmapRef}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
