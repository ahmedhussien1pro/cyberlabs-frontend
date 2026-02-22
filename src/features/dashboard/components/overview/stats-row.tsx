import {
  FlaskConical,
  BookOpen,
  Clock,
  Flame,
  Trophy,
  Star,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/shared/components/common/stat-card';
import { useUserStats, useUserPoints } from '@/shared/hooks/use-user-data';

export function StatsRow() {
  const { t } = useTranslation('dashboard');
  const { data: stats, isLoading: sl } = useUserStats();
  const { data: points, isLoading: pl } = useUserPoints();

  if (sl || pl) {
    return (
      <div className='grid grid-cols-3 gap-3 sm:grid-cols-6'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-24 rounded-xl' />
        ))}
      </div>
    );
  }

  const items = [
    {
      icon: Trophy,
      label: t('stats.xp'),
      value: (points?.totalXP ?? 0).toLocaleString(),
      color: 'text-yellow-500',
      delay: 0,
    },
    {
      icon: Star,
      label: t('stats.points'),
      value: (points?.totalPoints ?? 0).toLocaleString(),
      color: 'text-purple-500',
      delay: 0.05,
    },
    {
      icon: FlaskConical,
      label: t('stats.labs'),
      value: stats?.completedLabs ?? 0,
      color: 'text-primary',
      delay: 0.1,
    },
    {
      icon: BookOpen,
      label: t('stats.courses'),
      value: stats?.completedCourses ?? 0,
      color: 'text-blue-500',
      delay: 0.15,
    },
    {
      icon: Flame,
      label: t('stats.streak'),
      value: `${stats?.currentStreak ?? 0}d`,
      color: 'text-orange-500',
      delay: 0.2,
    },
    {
      icon: Clock,
      label: t('stats.hours'),
      value: `${stats?.totalHours ?? 0}h`,
      color: 'text-green-500',
      delay: 0.25,
    },
  ];

  return (
    <div className='grid grid-cols-3 gap-3 sm:grid-cols-6'>
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}
