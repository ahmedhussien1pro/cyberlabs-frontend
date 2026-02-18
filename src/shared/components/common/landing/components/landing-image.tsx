import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DEFAULT_COURSE_IMAGE } from '../constants';
import type { LandingImageProps } from '../types';

export function LandingImage({
  src,
  alt,
  students,
  className,
}: LandingImageProps) {
  const { t } = useTranslation('courses');

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 sticky top-8',
        className,
      )}>
      {/* Image Wrapper */}
      <div
        className={cn(
          'relative w-40 h-40 rounded-xl overflow-hidden',
          'bg-gradient-to-br from-primary/15 to-cyan-500/15',
          'shadow-lg transition-all duration-300',
          'hover:shadow-xl',
          // Glow effect
          'before:absolute before:inset-0 before:-z-10 before:blur-xl',
          'before:bg-gradient-to-br before:from-primary/50 before:to-cyan-500/30',
          'before:opacity-50',
        )}>
        <img
          src={src || DEFAULT_COURSE_IMAGE}
          alt={alt}
          className='w-full h-full object-cover'
          loading='lazy'
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_COURSE_IMAGE;
          }}
        />
      </div>

      {/* Students Badge */}
      {students && students > 0 && (
        <Badge
          variant='secondary'
          className={cn(
            'gap-2 px-3 py-1.5 font-semibold text-xs',
            'bg-primary/10 border border-primary/25 text-foreground',
            'dark:border-primary/20',
            'backdrop-blur-sm transition-all',
            'hover:bg-primary/15 hover:border-primary/30',
          )}>
          <Users className='h-3.5 w-3.5 text-primary' aria-hidden='true' />
          <span>
            {students.toLocaleString()}+ {t('stats.enrolled')}
          </span>
        </Badge>
      )}
    </div>
  );
}
