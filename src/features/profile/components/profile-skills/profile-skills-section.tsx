// src/features/profile/components/profile-skills/profile-skills-section.tsx
import { motion } from 'framer-motion';
import { Zap, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SkillBar } from './skill-bar';
import type { UserSkill } from '../../types/profile.types';

export function ProfileSkillsSection({ skills }: { skills: UserSkill[] }) {
  const { t } = useTranslation('profile');

  // ── Coming Soon empty state ────────────────────────────────────────
  if (!skills?.length) {
    return (
      <section className='space-y-3'>
        <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          <Zap className='h-4 w-4 text-primary' />
          {t('skills')}
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/20 bg-primary/[0.03] py-10 text-center'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10'>
            <Rocket className='h-5 w-5 text-primary/70' />
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-semibold text-foreground/70'>Skill Tracking</p>
            <p className='max-w-xs text-xs leading-relaxed text-muted-foreground'>
              Your skills will be tracked automatically as you complete labs and courses.
            </p>
          </div>
          <span className='rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary'>
            🚀 Coming Soon
          </span>
        </motion.div>
      </section>
    );
  }

  return (
    <section className='space-y-3'>
      <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
        <Zap className='h-4 w-4 text-primary' />
        {t('skills')}
        <span className='rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary'>
          {skills.length}
        </span>
      </h2>
      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
        {skills.map((s, i) => (
          <SkillBar key={s.id} skill={s} delay={i * 0.04} />
        ))}
      </div>
    </section>
  );
}
