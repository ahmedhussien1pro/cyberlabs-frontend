// src/features/about/components/team-section.tsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/shared/components/common';
import { TeamCard } from './team-card';
import { TEAM_MEMBERS } from '../constants/members';

export function TeamSection() {
  const { t } = useTranslation('about');

  return (
    <section className='relative overflow-hidden py-6 md:py-10'>
      <div className='absolute inset-0 -z-10'>
        <div className='absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent' />
        <div className='absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-3xl' />
        <div className='absolute -right-20 top-0 h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-3xl' />
      </div>

      <div className='container'>
        <SectionHeader title={t('team.label')} subtitle={t('team.title')} />

        {/* Subtitle divider */}
        <motion.div
          className='mb-8 flex items-center gap-3'
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.4 }}>
          <div className='h-px flex-1 bg-gradient-to-r from-transparent to-primary/50' />
          <h5 className='text-xs font-semibold uppercase tracking-widest text-primary/70'>
            {t('team.subtitle')}
          </h5>
          <div className='h-px flex-1 bg-gradient-to-l from-transparent to-primary/50' />
        </motion.div>

        <div className='mt-6 flex flex-wrap justify-center gap-5'>
          {TEAM_MEMBERS.map((member, i) => (
            <TeamCard key={member.key} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
