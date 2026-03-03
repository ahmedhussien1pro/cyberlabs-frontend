// src/features/paths/components/paths-hero.tsx
import { useTranslation } from 'react-i18next';
import { Route, Search, BookOpen, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LandingLayout } from '@/shared/components/common/landing/landing-layout';

const PATHS_IMAGE = '/assets/images/practice.png';

interface PathsHeroProps {
  search: string;
  onSearchChange: (v: string) => void;
  totalCount?: number;
}

export function PathsHero({
  search,
  onSearchChange,
  totalCount,
}: PathsHeroProps) {
  const { t } = useTranslation('paths');

  return (
    <LandingLayout
      imageUrl={PATHS_IMAGE}
      imageAlt={t('hero.imageAlt')}
      mobileImageSize={90}
      //   showMobileImage={false}
      className='[&_.landing-image-wrapper]:lg:col-span-5 [&_.landing-content-wrapper]:lg:col-span-7'>
      {/* ── Desktop ─────────────────────────────────────────────── */}
      <div className='hidden lg:block'>
        <HeroContent
          t={t}
          search={search}
          onSearchChange={onSearchChange}
          totalCount={totalCount}
        />
      </div>

      {/* ── Mobile ──────────────────────────────────────────────── */}
      <div className='lg:hidden'>
        <div className='mb-3 flex items-center justify-between gap-3'>
          <div className='min-w-0 flex-1'>
            <EyebrowBadge label={t('hero.eyebrow')} />
            <h1 className='mt-2 text-xl font-extrabold leading-tight text-primary'>
              {t('hero.title')}
            </h1>
            <h2 className='mt-0.5 text-sm font-semibold leading-tight text-white/80'>
              {t('hero.subtitle')}
            </h2>
          </div>

          {/* Inline image — mobile */}
          <div className='h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary shadow-lg shadow-primary/30'>
            <img
              src={PATHS_IMAGE}
              alt={t('hero.imageAlt')}
              className='h-full w-full object-cover'
              loading='eager'
            />
          </div>
        </div>

        <HeroSearch t={t} search={search} onSearchChange={onSearchChange} />

        {totalCount !== undefined && (
          <p className='mt-3 text-xs text-white/50'>
            <strong className='text-white'>{totalCount}</strong>{' '}
            {t('hero.available')}
          </p>
        )}
      </div>
    </LandingLayout>
  );
}

// ── File-private sub-components ───────────────────────────────────────

interface ContentProps {
  t: ReturnType<typeof useTranslation<'paths'>>['t'];
  search: string;
  onSearchChange: (v: string) => void;
  totalCount?: number;
}

function HeroContent({ t, search, onSearchChange, totalCount }: ContentProps) {
  return (
    <>
      {/* <EyebrowBadge label={t('hero.eyebrow')} /> */}

      {/* Title */}
      <h1
        className={cn(
          ' text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-1',
          'text-primary',
        )}>
        {t('hero.title')}
      </h1>

      {/* Subtitle */}
      <h2 className='text-base md:text-lg font-semibold leading-tight mb-3 text-white/80'>
        {t('hero.subtitle')}
      </h2>

      {/* Description */}
      <p className='text-sm md:text-base leading-relaxed mb-5 max-w-lg text-white/60'>
        {t('hero.description')}
      </p>

      {/* Search */}
      <HeroSearch t={t} search={search} onSearchChange={onSearchChange} />

      {/* Stats row */}
      {totalCount !== undefined && (
        <div className='mt-5 flex flex-wrap items-center gap-5'>
          <StatPill
            icon={<LayoutGrid className='h-3.5 w-3.5 text-primary' />}
            value={String(totalCount)}
            label={t('hero.available')}
          />
          <StatPill
            icon={<BookOpen className='h-3.5 w-3.5 text-primary' />}
            label={t('hero.zeroToExpert')}
          />
        </div>
      )}
    </>
  );
}

// ── Search input
// NOTE: MatrixRain overlay is ALWAYS dark (from-black/75) in both light and dark
//       themes — so we style exclusively for a dark background. No dark: prefix needed.
interface SearchProps {
  t: ReturnType<typeof useTranslation<'paths'>>['t'];
  search: string;
  onSearchChange: (v: string) => void;
}

function HeroSearch({ t, search, onSearchChange }: SearchProps) {
  return (
    <div className='relative max-w-sm'>
      <Search
        className='pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40'
        aria-hidden='true'
      />
      <Input
        placeholder={t('hero.searchPlaceholder')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        // Always-dark styling — no dark: override needed since MatrixRain overlay
        // forces bg-black/75 on the section regardless of color-scheme.
        className={cn(
          'h-10 rounded-lg ps-9 text-sm',
          'border border-white/20 bg-white/10 text-white',
          'placeholder:text-white/40',
          'shadow-inner shadow-black/20',
          'focus-visible:border-primary/60 focus-visible:bg-white/15',
          'focus-visible:ring-1 focus-visible:ring-primary/30',
          'focus-visible:ring-offset-0',
          // Removes the white bg that browser injects on autofill
          '[&:-webkit-autofill]:!bg-transparent',
        )}
      />
    </div>
  );
}

// ── Eyebrow badge
function EyebrowBadge({ label }: { label: string }) {
  return (
    <div className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary'>
      <Route className='h-3 w-3' />
      {label}
    </div>
  );
}

// ── Stats pill
interface StatPillProps {
  icon: React.ReactNode;
  value?: string;
  label: string;
}

function StatPill({ icon, value, label }: StatPillProps) {
  return (
    <div className='flex items-center gap-1.5 text-xs text-white/50'>
      {icon}
      {value && (
        <strong className='text-sm font-bold text-white'>{value}</strong>
      )}
      <span>{label}</span>
    </div>
  );
}
