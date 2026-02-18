/**
 * Action Buttons Component
 * Save and favorite buttons for course landing
 * @module shared/components/landing/components
 */

import { Bookmark, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ActionButtonsProps } from '../types';

export function ActionButtons({
  onSave,
  onFavorite,
  isSaved = false,
  isFavorite = false,
}: ActionButtonsProps) {
  const { t } = useTranslation('courses');

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg overflow-hidden',
        'bg-primary/5 border border-primary/25 backdrop-blur-sm',
        'dark:border-primary/20',
        'transition-all duration-300 hover:border-primary/40',
        'shadow-sm',
      )}>
      {/* Save Button */}
      <Button
        variant='ghost'
        size='default'
        onClick={onSave}
        className={cn(
          'gap-2 rounded-none border-0 px-4 py-2 font-semibold text-sm text-white/80',
          'hover:bg-primary/10 transition-colors',
          isSaved && 'text-primary',
        )}
        aria-label={isSaved ? t('actions.saved') : t('actions.save')}>
        <Bookmark
          className={cn('h-4 w-4 transition-all', isSaved && 'fill-primary')}
        />
        <span className='hidden sm:inline'>
          {isSaved ? t('actions.saved') : t('actions.save')}
        </span>
      </Button>

      {/* Divider */}
      <div
        className='h-6 w-[1.5px] bg-primary/25 dark:bg-primary/20'
        aria-hidden='true'
      />

      {/* Favorite Button */}
      <Button
        variant='ghost'
        size='icon'
        onClick={onFavorite}
        className={cn(
          'rounded-none border-0 px-3 py-2 text-white/80',
          'hover:bg-primary/10 transition-all',
          isFavorite && 'text-red-600 dark:text-red-500',
        )}
        aria-label={
          isFavorite ? t('actions.unfavorite') : t('actions.favorite')
        }>
        <Heart
          className={cn(
            'h-4 w-4 transition-all',
            isFavorite && 'fill-red-600 dark:fill-red-500 animate-heartbeat',
          )}
        />
      </Button>
    </div>
  );
}
