import { Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BadgeCard } from './badge-card';
import type { UserBadge } from '../../types/profile.types';

export function ProfileBadgesSection({ badges }: { badges: UserBadge[] }) {
  const { t } = useTranslation('profile');
  if (!badges?.length) return null;
  return (
    <section className='space-y-3'>
      <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
        <Award className='h-4 w-4 text-primary' />
        {t('badges')}
        <span className='rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary'>
          {badges.length}
        </span>
      </h2>
      <div className='grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10'>
        {badges.map((b, i) => (
          <BadgeCard key={b.id} badge={b} delay={i * 0.03} />
        ))}
      </div>
    </section>
  );
}
