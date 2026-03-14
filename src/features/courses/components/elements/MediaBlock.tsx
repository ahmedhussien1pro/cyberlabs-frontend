// src/features/courses/components/elements/MediaBlock.tsx
import type { Lang } from '../../hooks/use-lang';
import type { TranslatedText } from '@/core/types/common.types';

const tl = (v: TranslatedText, l: Lang) => (l === 'ar' ? v.ar : v.en);

export function VideoBlock({ el, lang }: { el: any; lang: Lang }) {
  return (
    <div className='my-6'>
      <div className='rounded-xl overflow-hidden border border-border shadow-md'>
        <iframe
          src={el.url}
          className='w-full aspect-video'
          allowFullScreen
          title={el.title ? tl(el.title, lang) : 'video'}
        />
      </div>
      {el.title && (
        <p className='mt-2 text-xs text-muted-foreground text-center'>
          {tl(el.title, lang)}
        </p>
      )}
    </div>
  );
}
