// src/shared/components/common/page-hero.tsx
import { Search, BookOpen, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LandingLayout } from '@/shared/components/common/landing/landing-layout';

const DEFAULT_IMAGE = '/assets/images/practice.png';

export interface PageHeroProps {
  title: string;
  subtitle: string;
  description: string;

  imageUrl?: string;
  imageAlt?: string;

  // Search
  showSearch?: boolean; // default: false
  search?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;

  // Stats
  totalCount?: number;
  totalCountLabel?: string;
  extraStatLabel?: string;
}

export function PageHero({
  title,
  subtitle,
  description,
  imageUrl = DEFAULT_IMAGE,
  imageAlt = '',
  showSearch = false,
  search = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  totalCount,
  totalCountLabel = '',
  extraStatLabel,
}: PageHeroProps) {
  return (
    <LandingLayout
      imageUrl={imageUrl}
      imageAlt={imageAlt}
      mobileImageSize={90}
      className='[&_.landing-image-wrapper]:lg:col-span-5 [&_.landing-content-wrapper]:lg:col-span-7'>
      {/* ── Desktop ── */}
      <div className='hidden lg:block'>
        {/* Title */}
        <h1
          className={cn(
            'text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-1',
            'text-primary',
          )}>
          {title}
        </h1>

        {/* Subtitle */}
        <h2 className='text-base md:text-lg font-semibold leading-tight mb-3 text-white/80'>
          {subtitle}
        </h2>

        {/* Description */}
        <p className='text-sm md:text-base leading-relaxed mb-5 max-w-lg text-white/60'>
          {description}
        </p>

        <div className='flex flex-wrap items-center justify-between'>
          {/* Search */}
          {showSearch && onSearchChange && (
            <PageHeroSearch
              value={search}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          )}

          {/* Stats */}
          {totalCount !== undefined && (
            <div className={cn('flex flex-wrap items-center gap-5')}>
              <StatPill
                icon={<LayoutGrid className='h-3.5 w-3.5 text-primary' />}
                value={String(totalCount)}
                label={totalCountLabel}
              />
              {extraStatLabel && (
                <StatPill
                  icon={<BookOpen className='h-3.5 w-3.5 text-primary' />}
                  label={extraStatLabel}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className='lg:hidden'>
        <div className='mb-3 flex items-center justify-between gap-3'>
          <div className='min-w-0 flex-1'>
            <h1 className='text-xl font-extrabold leading-tight text-primary'>
              {title}
            </h1>
            <h2 className='mt-0.5 text-sm font-semibold leading-tight text-white/80'>
              {subtitle}
            </h2>
          </div>

          {/* Inline image — mobile */}
          <div className='h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary shadow-lg shadow-primary/30'>
            <img
              src={imageUrl}
              alt={imageAlt}
              className='h-full w-full object-cover'
              loading='eager'
            />
          </div>
        </div>

        {/* Search — mobile */}
        {showSearch && onSearchChange && (
          <PageHeroSearch
            value={search}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        )}

        {totalCount !== undefined && (
          <p className='mt-3 text-xs text-white/50'>
            <strong className='text-white'>{totalCount}</strong>{' '}
            {totalCountLabel}
          </p>
        )}
      </div>
    </LandingLayout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────

function PageHeroSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className='relative max-w-sm'>
      <Search
        className='pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40'
        aria-hidden='true'
      />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-10 rounded-lg ps-9 text-sm',
          'border border-white/20 bg-white/10 text-white',
          'placeholder:text-white/40',
          'shadow-inner shadow-black/20',
          'focus-visible:border-primary/60 focus-visible:bg-white/15',
          'focus-visible:ring-1 focus-visible:ring-primary/30',
          'focus-visible:ring-offset-0',
          '[&:-webkit-autofill]:!bg-transparent',
        )}
      />
    </div>
  );
}

function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value?: string;
  label: string;
}) {
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
