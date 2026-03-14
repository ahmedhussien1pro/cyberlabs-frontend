// src/features/courses/components/elements/ImageBlock.tsx
import { cn } from '@/lib/utils';
import { ZoomableImage } from '../image-lightbox';
import type { Lang } from '../../hooks/use-lang';
import type { TranslatedText } from '@/core/types/common.types';

const tl = (v: TranslatedText, l: Lang) => (l === 'ar' ? v.ar : v.en);
const IMG_SIZE: Record<string, string> = {
  small: 'max-w-sm mx-auto', medium: 'max-w-2xl mx-auto',
  large: 'max-w-4xl mx-auto', full: 'w-full',
};

export function ImageBlock({
  el,
  lang,
  imageMap = {},
  onZoom,
}: {
  el: any;
  lang: Lang;
  imageMap?: Record<string, string>;
  onZoom: (src: string, alt?: string) => void;
}) {
  const src = el.imageUrl ?? (el.srcKey ? (imageMap[el.srcKey] ?? el.srcKey) : '');
  if (!src) return null;
  const alt = el.alt ? tl(el.alt, lang) : '';
  return (
    <figure className={cn('my-6', IMG_SIZE[el.size ?? 'full'])}>
      <ZoomableImage
        src={src}
        alt={alt}
        className='rounded-xl border border-border shadow-md w-full h-auto object-cover'
        wrapperClassName='rounded-xl overflow-hidden'
        onZoom={onZoom}
      />
      {el.alt && (
        <figcaption className='mt-2 text-xs text-muted-foreground text-center'>{alt}</figcaption>
      )}
    </figure>
  );
}
