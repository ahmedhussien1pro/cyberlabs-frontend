// src/features/pricing/components/pricing-hero.tsx
import { useTranslation } from 'react-i18next';
import { CreditCard, Users, BookOpen, Award, Shield } from 'lucide-react';
import { LandingLayout } from '@/shared/components/common/landing/landing-layout';

const STAT_ITEMS = [
  {
    icon: Users,
    vKey: 'pricing.stats.users',
    lKey: 'pricing.stats.usersLabel',
  },
  {
    icon: BookOpen,
    vKey: 'pricing.stats.labs',
    lKey: 'pricing.stats.labsLabel',
  },
  {
    icon: Award,
    vKey: 'pricing.stats.certs',
    lKey: 'pricing.stats.certsLabel',
  },
  {
    icon: Shield,
    vKey: 'pricing.stats.uptime',
    lKey: 'pricing.stats.uptimeLabel',
  },
] as const;

export function PricingHero() {
  const { t } = useTranslation('pricing');

  return (
    <LandingLayout
      //   showMobileImage={false}
      className='[&_.landing-image-wrapper]:lg:col-span-5 [&_.landing-content-wrapper]:lg:col-span-6'>
      {/* ── Desktop ────────────────────────────────────────── */}
      <div className='hidden lg:block'>
        <HeroContent t={t} />
      </div>

      {/* ── Mobile ─────────────────────────────────────────── */}
      <div className='lg:hidden'>
        <EyebrowBadge label={t('pricing.eyebrow')} />
        <h1 className='mt-2 text-xl font-extrabold leading-tight text-primary'>
          {t('pricing.heroTitle')}
        </h1>
        <h2 className='mt-0.5 text-sm font-semibold leading-tight text-white/80'>
          {t('pricing.heroSubtitle')}
        </h2>
        <div className='mt-4 grid grid-cols-2 gap-2'>
          {STAT_ITEMS.map(({ icon: Icon, vKey, lKey }) => (
            <StatBox
              key={vKey}
              icon={<Icon className='h-4 w-4' />}
              value={t(vKey)}
              label={t(lKey)}
            />
          ))}
        </div>
      </div>

      {/* ── Right column: Stat Boxes (Desktop replaces image) ── */}
      <div className='hidden lg:grid grid-cols-4 gap-3'>
        {STAT_ITEMS.map(({ icon: Icon, vKey, lKey }) => (
          <StatBox
            key={vKey}
            icon={<Icon className='h-6 w-6' />}
            value={t(vKey)}
            label={t(lKey)}
          />
        ))}
        <div className='col-span-2 mt-1 text-center text-[11px] text-white/35'>
          {t('pricing.trust.inline')}
        </div>
      </div>
    </LandingLayout>
  );
}

function HeroContent({
  t,
}: {
  t: ReturnType<typeof useTranslation<'pricing'>>['t'];
}) {
  return (
    <>
      <EyebrowBadge label={t('pricing.eyebrow')} />
      <h1 className='mt-3 text-2xl font-extrabold leading-tight text-primary md:text-3xl lg:text-4xl'>
        {t('pricing.heroTitle')}
      </h1>
      <h2 className='mb-3 mt-1 text-base font-semibold leading-tight text-white/80 md:text-lg'>
        {t('pricing.heroSubtitle')}
      </h2>
      <p className='mb-4 max-w-lg text-sm leading-relaxed text-white/60 md:text-base'>
        {t('pricing.heroDesc')}
      </p>
    </>
  );
}

function EyebrowBadge({ label }: { label: string }) {
  return (
    <div className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary'>
      <CreditCard className='h-3 w-3' />
      {label}
    </div>
  );
}

function StatBox({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className='flex flex-row items-center justify-around rounded-2xl  border border-white/10 bg-white/5 py-4  backdrop-blur-sm'>
      <div className='text-primary'>{icon}</div>
      <div>
        <p className='text-xl font-black text-white'>{value}</p>
        <p className='text-[11px] text-white/50'>{label}</p>
      </div>
    </div>
  );
}
