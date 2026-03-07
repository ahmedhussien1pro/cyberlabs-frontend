// src/features/profile/components/profile-skills/profile-skills-section.tsx
import { Zap, BookOpen, Shield, Target, Server, Lock, Globe, Wrench, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfileSkills, type SkillItem } from '../../hooks/use-profile-skills';

// ── Level metadata ──────────────────────────────────────────
const LEVELS = {
  BEGINNER:     { label: 'Beginner',     ar: 'مبتدئ',  defaultPct: 25,  bar: 'bg-emerald-500' },
  INTERMEDIATE: { label: 'Intermediate', ar: 'متوسط',  defaultPct: 50,  bar: 'bg-blue-500' },
  ADVANCED:     { label: 'Advanced',     ar: 'متقدم',  defaultPct: 75,  bar: 'bg-violet-500' },
  EXPERT:       { label: 'Expert',       ar: 'خبير',   defaultPct: 100, bar: 'bg-amber-500' },
} as const;

const LEVEL_BADGE_CLS: Record<string, string> = {
  BEGINNER:     'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  INTERMEDIATE: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  ADVANCED:     'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  EXPERT:       'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

// ── Category metadata ────────────────────────────────────────
type IconFC = React.FC<{ className?: string }>;
const CATS: Record<string, { Icon: IconFC; ring: string; iconColor: string }> = {
  WEB_SECURITY:         { Icon: Globe as IconFC,     ring: 'border-red-500/25',     iconColor: 'text-red-500' },
  PENETRATION_TESTING:  { Icon: Target as IconFC,    ring: 'border-orange-500/25',  iconColor: 'text-orange-500' },
  MALWARE_ANALYSIS:     { Icon: Shield as IconFC,    ring: 'border-purple-500/25',  iconColor: 'text-purple-500' },
  CLOUD_SECURITY:       { Icon: Server as IconFC,    ring: 'border-blue-500/25',    iconColor: 'text-blue-500' },
  FUNDAMENTALS:         { Icon: BookOpen as IconFC,  ring: 'border-emerald-500/25', iconColor: 'text-emerald-500' },
  CRYPTOGRAPHY:         { Icon: Lock as IconFC,      ring: 'border-yellow-500/25',  iconColor: 'text-yellow-500' },
  NETWORK_SECURITY:     { Icon: Server as IconFC,    ring: 'border-cyan-500/25',    iconColor: 'text-cyan-500' },
  TOOLS_AND_TECHNIQUES: { Icon: Wrench as IconFC,    ring: 'border-indigo-500/25',  iconColor: 'text-indigo-500' },
  CAREER_AND_INDUSTRY:  { Icon: Briefcase as IconFC, ring: 'border-pink-500/25',    iconColor: 'text-pink-500' },
};
const DEFAULT_CAT = { Icon: Zap as IconFC, ring: 'border-border/40', iconColor: 'text-muted-foreground' };

// ── Component ────────────────────────────────────────────────────────
export function ProfileSkillsSection() {
  const { i18n } = useTranslation('profile');
  const isAr = i18n.language === 'ar';
  const { data: skills = [], isLoading } = useProfileSkills();

  if (isLoading) return <SkillsSkeleton />;

  return (
    <section className='space-y-3'>
      {/* Header */}
      <div className='flex items-center gap-2'>
        <Zap className='h-5 w-5 text-primary' />
        <h2 className='text-base font-bold text-foreground'>
          {isAr ? 'المهارات' : 'Skills'}
        </h2>
        {skills.length > 0 && (
          <span className='rounded-full border border-primary/20 bg-primary/10 px-2 py-px text-xs font-bold text-primary'>
            {skills.length}
          </span>
        )}
      </div>

      {/* Grid */}
      {skills.length === 0 ? (
        <EmptySkills isAr={isAr} />
      ) : (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
          {skills.map((item, i) => (
            <SkillCard key={item.id} item={item} isAr={isAr} delay={i * 0.04} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Skill Card ────────────────────────────────────────────────────────
function SkillCard({ item, isAr, delay }: { item: SkillItem; isAr: boolean; delay: number }) {
  const lvl = LEVELS[item.level] ?? LEVELS.BEGINNER;
  const catKey = item.skill.category ?? 'FUNDAMENTALS';
  const cat = CATS[catKey] ?? DEFAULT_CAT;
  const { Icon } = cat;
  const name = isAr ? (item.skill.ar_name ?? item.skill.name) : item.skill.name;
  const pct = item.progress > 0 ? item.progress : lvl.defaultPct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay }}
      className={cn(
        'group rounded-xl border bg-card/60 p-3 transition-all duration-200',
        'hover:border-primary/30 hover:bg-card hover:shadow-sm',
        cat.ring,
      )}
    >
      {/* Category icon + label */}
      <div className='mb-2 flex items-center gap-2'>
        <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60'>
          <Icon className={cn('h-3.5 w-3.5', cat.iconColor)} />
        </div>
        <span className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
          {catKey.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Skill name */}
      <p className='mb-1.5 line-clamp-2 text-sm font-semibold leading-tight text-foreground'>
        {name}
      </p>

      {/* Level badge */}
      <span className={cn(
        'mb-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide',
        LEVEL_BADGE_CLS[item.level] ?? LEVEL_BADGE_CLS.BEGINNER,
      )}>
        {isAr ? lvl.ar : lvl.label}
      </span>

      {/* Progress bar */}
      <div className='h-1.5 overflow-hidden rounded-full bg-muted/60'>
        <motion.div
          className={cn('h-full rounded-full', lvl.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.55, delay: delay + 0.18, ease: 'easeOut' }}
        />
      </div>
      <p className='mt-1 text-right text-[9px] text-muted-foreground/60'>{pct}%</p>
    </motion.div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────
function EmptySkills({ isAr }: { isAr: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/20 bg-primary/[0.03] py-12 text-center'
    >
      <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10'>
        <Zap className='h-5 w-5 text-primary/60' />
      </div>
      <p className='text-sm font-semibold text-foreground/70'>
        {isAr ? 'لا توجد مهارات بعد' : 'No skills tracked yet'}
      </p>
      <p className='max-w-xs text-xs leading-relaxed text-muted-foreground'>
        {isAr
          ? 'ستُتتبع مهاراتك تلقائيّاً عند إتمام المختبرات والكورسات.'
          : 'Your skills will be tracked automatically as you complete labs and courses.'}
      </p>
    </motion.div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function SkillsSkeleton() {
  return (
    <section className='space-y-3'>
      <Skeleton className='h-6 w-28' />
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-28 rounded-xl' />
        ))}
      </div>
    </section>
  );
}
