import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CreditCard, Users, BookOpen, Award, Shield } from 'lucide-react';
import { MatrixRain } from '@/shared/components/common/landing/matrix-rain';

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
    <div className='relative overflow-hidden'>
      {/* ── Background ─────────────────────────────────── */}
      <MatrixRain opacity={0.13} speed={5} />
      <div className='absolute inset-0 z-[1] bg-gradient-to-br from-black/80 via-primary/10 to-black/80' />

      {/* ── Content ────────────────────────────────────── */}
      <div className='container relative z-[2] mx-auto px-4 py-10 md:py-12'>
        <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-12'>
          {/* LEFT: Text */}
          <motion.div
            className='lg:col-span-7'
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.1] }}>
            <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary'>
              <CreditCard className='h-3 w-3' />
              {t('pricing.eyebrow')}
            </div>

            <h1 className='mb-2 text-3xl font-extrabold leading-tight tracking-tight text-primary md:text-4xl lg:text-5xl'>
              {t('pricing.heroTitle')}
            </h1>
            <h2 className='mb-4 text-base font-semibold text-white/75 md:text-lg'>
              {t('pricing.heroSubtitle')}
            </h2>
            <p className='max-w-lg text-sm leading-relaxed text-white/50 md:text-base'>
              {t('pricing.heroDesc')}
            </p>

            {/* Mobile stat strip */}
            <div className='mt-6 grid grid-cols-4 gap-2 lg:hidden'>
              {STAT_ITEMS.map(({ icon: Icon, vKey, lKey }, i) => (
                <motion.div
                  key={vKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                  className='flex flex-col items-center gap-0.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-center backdrop-blur-sm'>
                  <Icon className='h-3.5 w-3.5 text-primary' />
                  <p className='text-xs font-bold text-white'>{t(vKey)}</p>
                  <p className='text-[9px] leading-tight text-white/45'>
                    {t(lKey)}
                  </p>
                </motion.div>
              ))}
            </div>
            <p className='mt-2 text-center text-[10px] text-white/30 lg:hidden'>
              {t('pricing.trust.inline')}
            </p>
          </motion.div>

          <motion.div
            className='hidden lg:col-span-5 lg:grid lg:grid-cols-2 lg:gap-3'
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.15,
              ease: [0.22, 0.68, 0, 1.1],
            }}>
            {STAT_ITEMS.map(({ icon: Icon, vKey, lKey }, i) => (
              <motion.div
                key={vKey}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.32, delay: 0.25 + i * 0.07 }}
                className=' group flex flex-row items-center  justify-around rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-primary/8'>
                {/* Icon wrapper — smaller */}
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25'>
                  <Icon className='h-4 w-4' />
                </div>
                {/* Value — smaller */}
                <div>
                  <p className='text-xl font-bold text-white'>{t(vKey)}</p>
                  {/* Label — smaller */}
                  <p className='text-[10px] text-white/50'>{t(lKey)}</p>
                </div>
              </motion.div>
            ))}

            {/* Trust note */}
            <p className='col-span-2 mt-1 text-center text-[10px] text-white/30'>
              {t('pricing.trust.inline')}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
