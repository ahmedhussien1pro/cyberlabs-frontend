import { useTranslation } from 'react-i18next';
import { LayoutGrid, Shield, Swords, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PathDifficulty, PathDifficultyCount } from '../types/path.types';

const TABS: {
  value: PathDifficulty | 'all';
  icon: React.ReactNode;
  key: string;
}[] = [
  {
    value: 'all',
    icon: <LayoutGrid className='h-3.5 w-3.5' />,
    key: 'filters.all',
  },
  {
    value: 'Beginner',
    icon: <Shield className='h-3.5 w-3.5' />,
    key: 'filters.Beginner',
  },
  {
    value: 'Intermediate',
    icon: <Swords className='h-3.5 w-3.5' />,
    key: 'filters.Intermediate',
  },
  {
    value: 'Advanced',
    icon: <Globe className='h-3.5 w-3.5' />,
    key: 'filters.Advanced',
  },
];

interface PathsFilterTabsProps {
  active: PathDifficulty | 'all';
  onChange: (v: PathDifficulty | 'all') => void;
  counts: PathDifficultyCount;
  loading?: boolean;
}

export function PathsFilterTabs({
  active,
  onChange,
  counts,
  loading,
}: PathsFilterTabsProps) {
  const { t } = useTranslation('paths');

  return (
    <div className='flex flex-wrap gap-2'>
      {TABS.map(({ value, icon, key }) => {
        const count =
          value === 'all'
            ? Object.values(counts).reduce((a, b) => a + b, 0)
            : (counts[value] ?? 0);
        const isActive = active === value;

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all',
              isActive
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground',
            )}>
            {icon}
            {t(key)}
            {!loading && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-px text-[9px] font-bold',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground',
                )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
