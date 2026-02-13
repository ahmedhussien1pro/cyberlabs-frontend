import { LucideIcon } from 'lucide-react';

interface AuthHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  iconColor?: 'primary' | 'success' | 'error' | 'warning';
}

const iconColorClasses = {
  primary: 'text-primary bg-primary/10',
  success: 'text-green-500 bg-green-500/10',
  error: 'text-destructive bg-destructive/10',
  warning: 'text-orange-500 bg-orange-500/10',
};

export function AuthHeader({
  icon: Icon,
  title,
  subtitle,
  iconColor = 'primary',
}: AuthHeaderProps) {
  return (
    <div className='text-center mb-8'>
      <div
        className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${iconColorClasses[iconColor]}`}>
        <Icon
          size={48}
          className={
            iconColor === 'primary'
              ? 'text-primary'
              : iconColor === 'success'
                ? 'text-green-500'
                : iconColor === 'error'
                  ? 'text-destructive'
                  : 'text-orange-500'
          }
        />
      </div>
      <h1 className='text-3xl font-bold text-foreground mb-3'>{title}</h1>
      {subtitle && <p className='text-muted-foreground text-sm'>{subtitle}</p>}
    </div>
  );
}
