// src/features/courses/components/elements/CodeBlock.tsx
import { Code2, Terminal } from 'lucide-react';
import type { Lang } from '../../hooks/use-lang';
import type { TranslatedText } from '@/core/types/common.types';

const tl = (v: TranslatedText, l: Lang) => (l === 'ar' ? v.ar : v.en);

export function CodeBlock({ el, lang }: { el: any; lang: Lang }) {
  return (
    <div className='my-5 rounded-xl overflow-hidden border border-border shadow-sm'>
      <div className='flex items-center gap-2 px-4 py-2 bg-muted/60 border-b border-border'>
        <Code2 className='h-4 w-4 text-muted-foreground' />
        <span className='text-xs font-mono text-muted-foreground uppercase tracking-wider'>
          {el.language ?? 'code'}
        </span>
        <div className='ms-auto flex gap-1.5'>
          <span className='h-3 w-3 rounded-full bg-red-500/60' />
          <span className='h-3 w-3 rounded-full bg-yellow-500/60' />
          <span className='h-3 w-3 rounded-full bg-green-500/60' />
        </div>
      </div>
      <pre className='p-4 bg-zinc-950 overflow-x-auto text-sm leading-relaxed'>
        <code className='text-zinc-100 font-mono'>{el.value ?? el.code}</code>
      </pre>
    </div>
  );
}

export function TerminalBlock({ el, lang }: { el: any; lang: Lang }) {
  return (
    <div className='my-5 rounded-xl overflow-hidden border border-border shadow-sm'>
      <div className='flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-700'>
        <div className='flex gap-1.5'>
          <span className='h-3 w-3 rounded-full bg-red-500' />
          <span className='h-3 w-3 rounded-full bg-yellow-500' />
          <span className='h-3 w-3 rounded-full bg-green-500' />
        </div>
        <Terminal className='h-3.5 w-3.5 text-zinc-400 ms-2' />
        <span className='text-xs text-zinc-400'>
          {el.label ? tl(el.label, lang) : 'Terminal'}
        </span>
      </div>
      <pre className='p-4 bg-zinc-950 overflow-x-auto text-sm'>
        <code className='text-green-400 font-mono'>$ {el.value}</code>
      </pre>
    </div>
  );
}
