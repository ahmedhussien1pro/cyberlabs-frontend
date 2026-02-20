import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SkillBar } from './skill-bar';
import type { UserSkill } from '../../types/profile.types';

export function ProfileSkillsSection({ skills }: { skills: UserSkill[] }) {
  const { t } = useTranslation('profile');
  if (!skills?.length) return null;
  return (
    <section className='space-y-3'>
      <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
        <Zap className='h-4 w-4 text-primary' /> {t('skills')}
      </h2>
      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
        {skills.map((s, i) => (
          <SkillBar key={s.id} skill={s} delay={i * 0.04} />
        ))}
      </div>
    </section>
  );
}
