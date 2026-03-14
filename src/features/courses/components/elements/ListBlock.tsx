// src/features/courses/components/elements/ListBlock.tsx
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lang } from '../../hooks/use-lang';
import type { TranslatedText } from '@/core/types/common.types';
import type { I18nArray } from '@/core/types/curriculumCourses.types';

const tl = (v: TranslatedText, l: Lang) => (l === 'ar' ? v.ar : v.en);
function resolveArray(arr: TranslatedText[] | I18nArray, lang: Lang): string[] {
  if (Array.isArray(arr)) return arr.map((v) => tl(v as TranslatedText, lang));
  return lang === 'ar' ? (arr as I18nArray).ar : (arr as I18nArray).en;
}

const IMG_SIZE: Record<string, string> = {
  small: 'max-w-sm mx-auto', medium: 'max-w-2xl mx-auto',
  large: 'max-w-4xl mx-auto', full: 'w-full',
};

export function ListBlock({ el, lang }: { el: any; lang: Lang }) {
  const items = resolveArray(el.items, lang);
  return (
    <div className='my-4'>
      {el.title && <p className='font-semibold mb-2 text-foreground'>{tl(el.title, lang)}</p>}
      <ul className='space-y-2'>
        {items.map((item: string, i: number) => (
          <li key={i} className='flex items-start gap-2.5 text-[15px] text-foreground/80'>
            <span className='mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OrderedListBlock({
  el,
  lang,
  imageMap = {},
}: {
  el: any;
  lang: Lang;
  imageMap?: Record<string, string>;
}) {
  return (
    <div className='my-6'>
      {el.title && <p className='font-semibold mb-3 text-foreground'>{tl(el.title, lang)}</p>}
      <ol className='space-y-5'>
        {el.items.map((item: any, i: number) => {
          const src =
            item.image?.imageUrl ??
            (item.image?.srcKey ? (imageMap[item.image.srcKey] ?? item.image.srcKey) : '');
          return (
            <li key={i} className='flex gap-4'>
              <span className='shrink-0 mt-0.5 h-7 w-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm'>
                {i + 1}
              </span>
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-foreground mb-1'>{tl(item.subtitle, lang)}</p>
                <p className='text-sm text-foreground/80 leading-relaxed'>{tl(item.text, lang)}</p>
                {item.example && (
                  <div className='mt-2 flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 border border-border/40'>
                    <Lightbulb className='h-3.5 w-3.5 mt-0.5 shrink-0 text-yellow-400' />
                    <span>{tl(item.example, lang)}</span>
                  </div>
                )}
                {src && (
                  <img
                    src={src}
                    className={cn('mt-3 rounded-lg border border-border w-full h-auto', IMG_SIZE[item.image?.size ?? 'medium'])}
                    alt=''
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
