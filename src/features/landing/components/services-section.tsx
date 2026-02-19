import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FlaskConical,
  ShieldAlert,
  UserRoundCog,
  BadgeCheck,
  TerminalSquare,
  type LucideIcon,
} from 'lucide-react';
import { SectionHeader } from '@/shared/components/common';
import { ROUTES } from '@/shared/constants';
import type { Variants, Easing } from 'framer-motion';

interface ServiceItem {
  key: string;
  icon: LucideIcon;
  color: string;
}

const services: ServiceItem[] = [
  { key: 'paths', icon: BookOpen, color: '#3b82f6' },
  { key: 'labs', icon: FlaskConical, color: '#10b981' },
  { key: 'threat', icon: ShieldAlert, color: '#ef4444' },
  { key: 'hacking', icon: UserRoundCog, color: '#f59e0b' },
  { key: 'cert', icon: BadgeCheck, color: '#06b6d4' },
  { key: 'projects', icon: TerminalSquare, color: '#8b5cf6' },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: 'easeOut' as Easing,
    },
  }),
};

export function ServicesSection() {
  const { t } = useTranslation('landing');

  return (
    <section className='relative overflow-hidden  py-6 md:py-10'>
      <div className='absolute inset-0 -z-10'>
        <div className='absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent' />
        <div className='absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent' />
      </div>

      <div className='container'>
        <SectionHeader
          title={t('services.title')}
          subtitle={t('services.subtitle')}
        />

        <div className='flex flex-wrap justify-center gap-6'>
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.key}
                custom={i}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: false, amount: 0.15 }}
                variants={cardVariants}
                className='w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]'>
                <div
                  className='service-card group relative flex h-[340px] flex-col items-center justify-center gap-5 overflow-hidden rounded-lg bg-card p-6 text-center shadow-md transition-transform duration-300 hover:-translate-y-1'
                  style={{ '--clr': service.color } as React.CSSProperties}>
                  {/* Icon */}
                  <div className='service-card__icon relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-card transition-all duration-500'>
                    <Icon className='service-card__icon-svg h-10 w-10 transition-all duration-500' />
                  </div>

                  {/* Text */}
                  <div className='relative z-10 flex flex-col gap-2'>
                    <h3 className='service-card__title text-base font-semibold text-foreground transition-colors duration-500'>
                      {t(`services.items.${service.key}.title`)}
                    </h3>
                    <p className='service-card__desc mx-auto max-w-[240px] text-sm leading-relaxed text-muted-foreground transition-colors duration-500'>
                      {t(`services.items.${service.key}.description`)}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    to={ROUTES.HOME}
                    className='service-card__link relative z-10 rounded px-4 py-2 text-sm font-medium transition-all duration-500'>
                    {t('services.readMore')}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
