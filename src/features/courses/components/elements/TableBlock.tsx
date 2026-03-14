// src/features/courses/components/elements/TableBlock.tsx
import type { Lang } from '../../hooks/use-lang';
import type { TranslatedText } from '@/core/types/common.types';
import type { I18nArray } from '@/core/types/curriculumCourses.types';

const tl = (v: TranslatedText, l: Lang) => (l === 'ar' ? v.ar : v.en);
function resolveArray(arr: TranslatedText[] | I18nArray, lang: Lang): string[] {
  if (Array.isArray(arr)) return arr.map((v) => tl(v as TranslatedText, lang));
  return lang === 'ar' ? (arr as I18nArray).ar : (arr as I18nArray).en;
}

export function TableBlock({ el, lang }: { el: any; lang: Lang }) {
  const headers = resolveArray(el.headers, lang);
  return (
    <div className='my-6 overflow-x-auto rounded-xl border border-border'>
      {el.title && (
        <div className='px-4 py-2 bg-muted/40 border-b border-border'>
          <p className='text-sm font-semibold'>{tl(el.title, lang)}</p>
        </div>
      )}
      <table className='w-full text-sm'>
        <thead className='bg-muted/30'>
          <tr>
            {headers.map((h: string, i: number) => (
              <th key={i} className='px-4 py-2.5 text-start font-semibold text-foreground/80 border-b border-border'>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {el.rows.map((row: any, ri: number) => {
            const cells = resolveArray(row, lang);
            return (
              <tr key={ri} className='border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors'>
                {cells.map((cell: string, ci: number) => (
                  <td key={ci} className='px-4 py-2.5 text-foreground/80'>{cell}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
