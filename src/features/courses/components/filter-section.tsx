// src/features/courses/components/filter-section.tsx
// Collapsible sidebar section — extracted from course-filters.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        className='w-full flex items-center justify-between px-1 py-1.5 group rounded-md hover:bg-muted/50 transition-colors'>
        <p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 group-hover:text-muted-foreground transition-colors'>
          {title}
        </p>
        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground/40 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className='overflow-hidden'>
            <div className='space-y-0.5 pt-1 pb-2'>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
