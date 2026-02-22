import {
  FlaskConical,
  BookOpen,
  Clock,
  Flame,
  Trophy,
  Star,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatCard } from '@/shared/components/common/stat-card';
import type { UserStats, UserPoints } from '@/shared/types/user.types';

interface Props {
  stats?: UserStats;
  points?: UserPoints;
}

export function ProfileStatsGrid({ stats, points }: Props) {
  const { t } = useTranslation('profile');

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
