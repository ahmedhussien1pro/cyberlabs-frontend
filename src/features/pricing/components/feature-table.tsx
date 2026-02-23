import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FEATURE_TABLE } from '../data/plans.data';

function Cell({
  value,
  highlight,
}: {
  value: boolean | string | number;
  highlight?: boolean;
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
        highlight ? 'text-foreground' : 'text-muted-foreground',
      )}>
      {value}
    </span>
  );
}

export function FeatureTable() {
  const { t } = useTranslation('pricing');

  return (
    <div className='overflow-x-auto rounded-2xl border border-border/50'>
      <table className='w-full min-w-[560px] text-sm'>
        <thead>
          <tr className='border-b border-border/50 bg-muted/30'>
            <th className='px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground w-[40%]'>
              {t('pricing.features.header')}
            </th>
            {(['free', 'pro', 'team'] as const).map((p) => (
              <th
                key={p}
                className='px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-foreground'>
                {t(`pricing.plans.${p}.name`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FEATURE_TABLE.map((row, i) => (
            <tr
              key={row.key}
              className={cn(
                'border-b border-border/30 transition-colors hover:bg-muted/20',
                i % 2 === 0 && 'bg-muted/5',
                row.highlight && 'bg-primary/3',
              )}>
              <td className='px-5 py-3 font-medium text-foreground/80'>
                {t(row.key)}
              </td>
              <td className='px-4 py-3 text-center'>
                <Cell value={row.free} highlight={row.highlight} />
              </td>
              <td className='px-4 py-3 text-center'>
                <Cell value={row.pro} highlight={row.highlight} />
              </td>
              <td className='px-4 py-3 text-center'>
                <Cell value={row.team} highlight={row.highlight} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
