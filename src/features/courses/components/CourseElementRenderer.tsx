// src/features/courses/components/CourseElementRenderer.tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLang } from '../hooks/use-lang';
import { ImageLightbox } from './image-lightbox';
import { CodeBlock, TerminalBlock } from './elements/CodeBlock';
import { NoteBlock } from './elements/NoteBlock';
import { TableBlock } from './elements/TableBlock';
import { ListBlock, OrderedListBlock } from './elements/ListBlock';
import { ImageBlock } from './elements/ImageBlock';
import { VideoBlock } from './elements/MediaBlock';
import type { CourseElement } from '@/core/types/curriculumCourses.types';
import type { TranslatedText } from '@/core/types/common.types';
import { ExternalLink } from 'lucide-react';

const tl = (v: TranslatedText, l: 'en' | 'ar') => (l === 'ar' ? v.ar : v.en);

interface Props {
  elements: CourseElement[];
  imageMap?: Record<string, string>;
}

export default function CourseElementRenderer({ elements, imageMap = {} }: Props) {
  const lang = useLang();
  const [lightbox, setLightbox] = useState<{ src: string; alt?: string } | null>(null);
  const openLightbox = (src: string, alt?: string) => setLightbox({ src, alt });

  return (
    <>
      <div className='space-y-1'>
        {elements.map((el, idx) => {
          switch (el.type) {
            case 'title':
              return (
                <h3 key={idx} className='text-2xl lg:text-3xl font-bold mt-10 mb-4 text-primary first:mt-0'>
                  {tl(el.value, lang)}
                </h3>
              );
            case 'subtitle':
              return (
                <h4 key={idx} className='text-xl font-semibold mt-7 mb-3 text-foreground/90'>
                  {tl(el.value, lang)}
                </h4>
              );
            case 'text': {
              const txt = tl(el.value, lang);
              if (txt.startsWith('[INFOGRAPHIC_HINT]')) return null;
              return <p key={idx} className='mb-4 text-foreground/80 leading-7 text-[15px]'>{txt}</p>;
            }
            case 'image':
              return <ImageBlock key={idx} el={el} lang={lang} imageMap={imageMap} onZoom={openLightbox} />;
            case 'video':
              return <VideoBlock key={idx} el={el} lang={lang} />;
            case 'list':
              return <ListBlock key={idx} el={el} lang={lang} />;
            case 'orderedList':
              return <OrderedListBlock key={idx} el={el} lang={lang} imageMap={imageMap} />;
            case 'code':
              return <CodeBlock key={idx} el={el} lang={lang} />;
            case 'terminal':
              return <TerminalBlock key={idx} el={el} lang={lang} />;
            case 'note':
              return <NoteBlock key={idx} el={el} lang={lang} />;
            case 'table':
              return <TableBlock key={idx} el={el} lang={lang} />;
            case 'hr':
              return <hr key={idx} className='my-8 border-border/40' />;
            case 'button':
              return (
                <div key={idx} className='my-4'>
                  <a
                    href={el.href}
                    target={el.newTab ? '_blank' : '_self'}
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors'>
                    {tl(el.label, lang)}
                    {el.newTab && <ExternalLink className='h-3.5 w-3.5' />}
                  </a>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
      <ImageLightbox
        src={lightbox?.src ?? ''}
        alt={lightbox?.alt}
        isOpen={!!lightbox}
        onClose={() => setLightbox(null)}
      />
    </>
  );
}
