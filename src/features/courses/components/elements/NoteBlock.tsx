// src/features/courses/components/elements/NoteBlock.tsx
import {
  Info,
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lang } from '../../hooks/use-lang';
import type { NoteVariant } from '@/core/types/curriculumCourses.types';
import type { TranslatedText } from '@/core/types/common.types';

const tl = (v: TranslatedText, l: Lang) => (l === 'ar' ? v.ar : v.en);

const NOTE_CFG: Record<NoteVariant, { Icon: React.ElementType; border: string; bg: string; text: string; iconColor: string }> = {
  info:    { Icon: Info,          border: 'border-blue-500/40',    bg: 'bg-blue-500/8',    text: 'text-blue-300',    iconColor: 'text-blue-400'    },
  warning: { Icon: AlertTriangle, border: 'border-yellow-500/40',  bg: 'bg-yellow-500/8',  text: 'text-yellow-300',  iconColor: 'text-yellow-400'  },
  danger:  { Icon: AlertOctagon,  border: 'border-red-500/40',     bg: 'bg-red-500/8',     text: 'text-red-300',     iconColor: 'text-red-400'     },
  success: { Icon: CheckCircle,   border: 'border-emerald-500/40', bg: 'bg-emerald-500/8', text: 'text-emerald-300', iconColor: 'text-emerald-400' },
};

export function NoteBlock({ el, lang }: { el: any; lang: Lang }) {
  const cfg = NOTE_CFG[el.noteType as NoteVariant ?? 'info'];
  return (
    <div className={cn('my-5 flex gap-3 rounded-xl border p-4', cfg.border, cfg.bg)}>
      <cfg.Icon className={cn('h-5 w-5 mt-0.5 shrink-0', cfg.iconColor)} />
      <div className='flex-1 text-sm leading-relaxed'>
        {el.isLab && (
          <strong className='font-bold me-1 text-foreground'>
            {lang === 'ar' ? 'اللابات:' : 'Labs:'}
          </strong>
        )}
        <span className={cfg.text}>{tl(el.value, lang)}</span>
        {el.link && (
          <a
            href={el.link}
            target='_blank'
            rel='noopener noreferrer'
            className='ms-1.5 inline-flex items-center gap-1 underline underline-offset-2 text-primary hover:text-primary/80'>
            {lang === 'ar' ? 'اقرأ المزيد' : 'Read more'}
            <ExternalLink className='h-3 w-3' />
          </a>
        )}
      </div>
    </div>
  );
}
