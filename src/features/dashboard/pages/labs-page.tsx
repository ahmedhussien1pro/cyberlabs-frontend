import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlaskConical,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ComingSoonBanner } from '@/shared/components/common/coming-soon-banner';
import { ROUTES } from '@/shared/constants';
import { useMyLabs } from '../hooks/use-labs-data';
import { LabCard } from '../components/labs/lab-card';
import type { LabStatus } from '../types/dashboard.types';

type Filter = LabStatus | 'all';

const FILTERS: { id: Filter; key: string }[] = [
  { id: 'all', key: 'labs.filter.all' },
  { id: 'active', key: 'labs.filter.active' },
  { id: 'completed', key: 'labs.filter.completed' },
  { id: 'not_started', key: 'labs.filter.notStarted' },
];

export default function LabsPage(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useMyLabs();

  const filtered = useMemo(() => {
    if (!data) return [];
    return data
      .filter((l) => filter === 'all' || l.status === filter)
      .filter(
        (l) =>
          !search.trim() ||
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          (l.ar_title ?? '').includes(search),
      );
  }, [data, filter, search]);

  return (
    <div className='container max-w-5xl space-y-6 py-6'>
      {/* ── Header ──────────────────────────────────── */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-xl font-black tracking-tight'>
            {t('labs.title')}
          </h1>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            {t('labs.subtitle')}
          </p>
        </div>
        <Button
          asChild
          variant='outline'
          size='sm'
          className='gap-1.5 self-start'>
          <Link to={ROUTES.LABS.LIST}>
            <FlaskConical size={13} />
            {t('labs.exploreAll')}
          </Link>
        </Button>
      </div>

      {/* ── Filters + Search ────────────────────────── */}
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search
            size={14}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('labs.searchPlaceholder')}
            className='pl-8'
          />
        </div>
        <div className='flex shrink-0 gap-1.5 overflow-x-auto'>
          {FILTERS.map((f) => (
            <Button
              key={f.id}
              size='sm'
              variant={filter === f.id ? 'default' : 'outline'}
              className='h-9 shrink-0'
              onClick={() => setFilter(f.id)}>
              {t(f.key)}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────── */}
      {isLoading ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-56 rounded-xl' />
          ))}
        </div>
      ) : isError ? (
        <Empty
          icon={<FlaskConical size={32} className='opacity-30' />}
          label={t('labs.loadError')}
        />
      ) : filtered.length === 0 ? (
        <Empty
          icon={<FlaskConical size={32} className='opacity-30' />}
          label={t('labs.empty')}
          hint={t('labs.emptyHint')}
          action={
            <Button asChild variant='outline' size='sm'>
              <Link to={ROUTES.LABS.LIST}>{t('labs.exploreAll')}</Link>
            </Button>
          }
        />
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filtered.map((lab, i) => (
            <LabCard key={lab.id} lab={lab} index={i} />
          ))}
        </div>
      )}

      {/* ── Coming Soon ─────────────────────────────── */}
      <div className='grid gap-3 sm:grid-cols-2'>
        <ComingSoonBanner
          icon={<SlidersHorizontal size={15} className='text-primary' />}
          title={t('labs.cs.filterTitle')}
          description={t('labs.cs.filterDesc')}
        />
        <ComingSoonBanner
          icon={<Sparkles size={15} className='text-primary' />}
          title={t('labs.cs.challengeTitle')}
          description={t('labs.cs.challengeDesc')}
        />
      </div>
    </div>
  );
}

/** Local empty-state helper */
function Empty({
  icon,
  label,
  hint,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className='flex flex-col items-center gap-3 rounded-xl border
                    border-dashed border-border/60 py-14 text-center text-muted-foreground'>
      {icon}
      <p className='text-sm font-medium'>{label}</p>
      {hint && <p className='text-xs'>{hint}</p>}
      {action}
    </div>
  );
}
