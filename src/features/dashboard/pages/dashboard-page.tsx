// src/features/dashboard/pages/dashboard-page.tsx

import { useTranslation } from 'react-i18next';
import { BookOpen, Trophy, Target, Clock } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useDashboardStats } from '../api';
import { StatsCard } from '../components/cards/stats-card';
import { formatStudyTime, formatXP } from '../utils';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardPage() {
  const { t } = useTranslation(['dashboard']);
  const { user } = useAuthStore();
  const { data: stats, isLoading } = useDashboardStats();

  const firstName = user?.name?.split(' ')[0] || 'Student';

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div>
        <h1 className='text-3xl font-bold'>
          {t('welcome')}, {firstName}! 👋
        </h1>
        <p className='mt-1 text-muted-foreground'>{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title={t('stats.coursesCompleted')}
          value={stats?.stats.coursesCompleted || 0}
          icon={<BookOpen className='h-4 w-4' />}
        />
        <StatsCard
          title={t('stats.totalXp')}
          value={formatXP(stats?.stats.totalXp || 0)}
          icon={<Trophy className='h-4 w-4' />}
        />
        <StatsCard
          title={t('stats.streak')}
          value={`${stats?.stats.streak || 0} days`}
          icon={<Target className='h-4 w-4' />}
        />
        <StatsCard
          title={t('stats.studyTime')}
          value={formatStudyTime(stats?.stats.studyTime || 0)}
          icon={<Clock className='h-4 w-4' />}
        />
      </div>

      {/* More sections will be added here */}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <div>
        <Skeleton className='h-9 w-64' />
        <Skeleton className='mt-1 h-5 w-96' />
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className='h-32' />
        ))}
      </div>
    </div>
  );
}
