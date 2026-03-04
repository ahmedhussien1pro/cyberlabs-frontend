// src/features/paths/pages/path-detail-page.tsx
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

import { PathDetailHero } from '../components/path-detail-hero';
import { PathRoadmap } from '../components/path-roadmap';
import { PathCardSkeleton } from '../components/path-card-skeleton';
import { usePath } from '../hooks/use-paths';
import { ROUTES } from '@/shared/constants';
import MainLayout from '@/shared/components/layout/main-layout';

export default function PathDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('paths');
  const { data: path, isLoading, isError } = usePath(slug ?? '');

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
            <PathDetailHero path={path} />
            <PathRoadmap modules={path.modules} />
          </>
        )}
      </div>
    </MainLayout>
  );
}
