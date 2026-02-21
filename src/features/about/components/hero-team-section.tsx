import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Activity, Crosshair } from 'lucide-react';

const ICONS = [
  {
    Icon: ShieldCheck,
    delay: 0,
    x: -40,
    y: -40,
    pos: 'left-0 top-0',
    label: 'Security',
  },
  {
    Icon: Cpu,
    delay: 0.1,
    x: 40,
    y: -40,
    pos: 'right-0 top-0',
    label: 'Technology',
  },
  {
    Icon: Activity,
    delay: 0.2,
    x: -40,
    y: 40,
    pos: 'bottom-0 left-0',
    label: 'Monitoring',
  },
  {
    Icon: Crosshair,
    delay: 0.3,
    x: 40,
    y: 40,
    pos: 'bottom-0 right-0',
    label: 'Targeting',
  },
] as const;

export function HeroTeamSection() {
  const { t } = useTranslation('about');

  const stats = [
    t('hero.stats.members', { returnObjects: true }),
    t('hero.stats.labs', { returnObjects: true }),
    t('hero.stats.users', { returnObjects: true }),
  ] as { value: string; label: string }[];

  return (
    <section className='relative overflow-hidden py-6 md:py-10'>
      <div className='absolute inset-0 -z-10'>
        <div className='absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent' />
        <div className='absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/[0.04] blur-3xl' />
        <div className='absolute -right-40 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-3xl' />
      </div>

      <div className='container'>
        <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-20'>
          <motion.div
            className='space-y-6'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}>
            <p className='flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary'>
              <span className='h-px w-6 bg-primary' />
              {t('hero.label')}
            </p>

            <h1 className='text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl'>
              {t('hero.title')}
            </h1>

            <p className='text-base leading-relaxed text-muted-foreground'>
              {t('hero.subtitle')}
            </p>

            <p className='border-s-2 border-primary ps-4 text-sm leading-relaxed text-muted-foreground'>
              {t('hero.mission')}
            </p>

            <div className='flex flex-wrap gap-6 pt-2'>
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className='rounded-xl border border-border/40 bg-card/60 px-4 py-3 text-center shadow-sm'>
                  <p className='text-2xl font-bold text-primary'>
                    {stat.value}
                  </p>
                  <p className='text-xs text-muted-foreground'>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Animated Icon Grid ── */}
          <motion.div
            className='flex items-center justify-center'
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}>
            <div className='relative h-80 w-80'>
              {/* Pulse rings */}
              <motion.div
                className='absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15'
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className='absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/8'
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.05, 0.2] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              />

              {/* Center glow blur */}
              <div className='absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-xl' />

              {/* Ring */}
              <div className='absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 ring-1 ring-primary/25' />

              {/* Center dot */}
              <motion.div
                className='absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/70 shadow-md shadow-primary/30'
                animate={{ scale: [1, 1.4, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Connecting lines */}
              <svg
                className='absolute inset-0 h-full w-full opacity-50'
                aria-hidden='true'>
                <line
                  x1='20%'
                  y1='20%'
                  x2='80%'
                  y2='80%'
                  stroke='currentColor'
                  strokeWidth='1'
                  className='text-primary'
                  strokeDasharray='4 4'
                />
                <line
                  x1='80%'
                  y1='20%'
                  x2='20%'
                  y2='80%'
                  stroke='currentColor'
                  strokeWidth='1'
                  className='text-primary'
                  strokeDasharray='4 4'
                />
              </svg>

              {/* Icon boxes */}
              {ICONS.map(({ Icon, delay, x, y, pos, label }, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${pos} flex h-[4.5rem] w-[4.5rem] cursor-default flex-col items-center justify-center gap-1 rounded-2xl border border-primary/20 bg-card shadow-lg shadow-primary/5`}
                  initial={{ opacity: 0, x, y }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: false }}
                  whileHover={{
                    scale: 1.12,
                    borderColor: 'hsl(var(--primary) / 0.5)',
                  }}
                  transition={{ duration: 0.6, delay }}>
                  <Icon className='h-6 w-6 text-primary' />
                  <span className='text-[0.55rem] font-medium text-muted-foreground'>
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
