import { Search, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { CourseFilters as IFilters } from '../types/course.types';

interface CourseFiltersProps {
  filters: IFilters;
  onChange: (f: IFilters) => void;
  onReset: () => void;
}

export function CourseFilters({
  filters,
  onChange,
  onReset,
}: CourseFiltersProps) {
  const { t } = useTranslation('courses');
  const hasActive = !!(
    filters.search ||
    filters.difficulty ||
    filters.access ||
    filters.category
  );

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* Search */}
      <div className='relative min-w-[200px] flex-1'>
        <Search className='absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder={t('filters.search', 'Search courses…')}
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className='ps-9'
        />
      </div>

      {/* Difficulty */}
      <Select
        value={filters.difficulty ?? 'all'}
        onValueChange={(v) =>
          onChange({
            ...filters,
            difficulty: v === 'all' ? undefined : (v as IFilters['difficulty']),
          })
        }>
        <SelectTrigger className='w-36'>
          <SelectValue placeholder={t('filters.difficulty', 'Difficulty')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('filters.all', 'All Levels')}</SelectItem>
          <SelectItem value='Beginner'>Beginner</SelectItem>
          <SelectItem value='Intermediate'>Intermediate</SelectItem>
          <SelectItem value='Advanced'>Advanced</SelectItem>
        </SelectContent>
      </Select>

      {/* Access */}
      <Select
        value={filters.access ?? 'all'}
        onValueChange={(v) =>
          onChange({
            ...filters,
            access: v === 'all' ? undefined : (v as IFilters['access']),
          })
        }>
        <SelectTrigger className='w-28'>
          <SelectValue placeholder={t('filters.access', 'Access')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('filters.all', 'All')}</SelectItem>
          <SelectItem value='free'>Free</SelectItem>
          <SelectItem value='pro'>Pro</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasActive && (
        <Button
          variant='ghost'
          size='sm'
          onClick={onReset}
          className='gap-1.5 text-muted-foreground hover:text-foreground'>
          <SlidersHorizontal className='h-3.5 w-3.5' />
          {t('filters.reset', 'Reset')}
        </Button>
      )}
    </div>
  );
}
