// src/features/pricing/components/feature-table.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/shared/components/common/section-header';
import { FEATURE_ROWS } from '../data/plans.data';

const ALWAYS_VISIBLE = 2;

export function FeatureTable() {
  const { t } = useTranslation('pricing');
  const [open, setOpen] = useState(false);
  const visible = open ? FEATURE_ROWS : FEATURE_ROWS.slice(0, ALWAYS_VISIBLE);
  const hidden = FEATURE_ROWS.length - ALWAYS_VISIBLE;

  return (
    <section className='container mx-auto px-4 py-14'>
      <SectionHeader
        title={t('pricing.compareTitle')}
        subtitle={t('pricing.compareDesc')}
      />

      <div className='overflow-x-auto rounded-2xl border border-border/50'>
        <table className='w-full min-w-[480px] text-sm'>
          <thead>
            <tr className='border-b border-border/50 bg-muted/30'>
              <th className='w-[45%] px-5 py-3.5 text-start text-[11px] font-bold uppercase tracking-widest text-muted-foreground'>
                {t('pricing.table.header')}
              </th>
              <th className='px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground'>
                {t('pricing.plans.free.name')}
              </th>
              <th className='px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-widest text-primary'>
                {t('pricing.plans.pro.name')}
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <motion.tr
                key={row.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: i * 0.04 }}
                className={cn(
                  'border-b border-border/30 transition-colors hover:bg-muted/20',
                  i % 2 === 0 && 'bg-muted/5',
                )}>
                <td
                  className={cn(
                    'px-5 py-3',
                    row.highlight
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground',
                  )}>
                  {t(row.key)}
                </td>
                <td className='px-4 py-3 text-center'>
                  <TableCell value={row.free} />
                </td>
                <td className='px-4 py-3 text-center'>
                  <TableCell value={row.pro} isHighlight />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-4 flex justify-center'>
        <button
          onClick={() => setOpen((v) => !v)}
          className='inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary'>
          {open ? (
            <>
              <ChevronUp className='h-3.5 w-3.5' />
              {t('pricing.hideRows')}
            </>
          ) : (
            <>
              <ChevronDown className='h-3.5 w-3.5' />
              {t('pricing.showRows', { count: hidden })}
            </>
          )}
        </button>
      </div>
    </section>
  );
}

function TableCell({
  value,
  isHighlight,
}: {
  value: boolean | string;
  isHighlight?: boolean;
}) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className='mx-auto h-4 w-4 text-emerald-500' />
    ) : (
      <X className='mx-auto h-4 w-4 text-muted-foreground/40' />
    );
  }
  return (
    <span
      className={cn(
        'text-xs font-semibold',
        isHighlight ? 'text-primary' : 'text-muted-foreground',
      )}>
      {value}
    </span>
  );
}
