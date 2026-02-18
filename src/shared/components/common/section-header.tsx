import { cn } from '@/shared/utils';
import '@/shared/styles/section-header.css';
interface SectionHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function SectionHeader({
  title,
  subtitle,
  className,
  align = 'start',
}: SectionHeaderProps) {
  const alignClass = {
    start: 'text-start',
    center: 'text-center',
    end: 'text-end',
  }[align];

  return (
    <div className={cn('pb-14 relative', alignClass, className)}>
      <h2 className='section-header__title'>{title}</h2>

      <p className='section-header__subtitle'>{subtitle}</p>
    </div>
  );
}
