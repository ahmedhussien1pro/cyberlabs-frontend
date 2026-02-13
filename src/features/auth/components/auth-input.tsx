import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { LucideIcon } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
  iconButton?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ icon: Icon, error, iconButton, className = '', ...props }, ref) => {
    return (
      <div className='space-y-1'>
        <div className='relative'>
          <Input
            ref={ref}
            className={`w-full h-12 ${Icon ? 'pl-4 pr-12' : 'px-4'} bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${className}`}
            {...props}
          />
          {Icon && !iconButton && (
            <Icon
              className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'
              size={20}
            />
          )}
          {iconButton && (
            <div className='absolute right-4 top-1/2 -translate-y-1/2'>
              {iconButton}
            </div>
          )}
        </div>
        {error && <p className='text-sm text-destructive ml-1'>{error}</p>}
      </div>
    );
  },
);

AuthInput.displayName = 'AuthInput';
