// src/components/layout/nav-dropdown.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/shared/utils';

interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
  className?: string;
}

export function NavDropdown({ label, items, className }: NavDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none',
          className,
        )}>
        {label}
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-56'>
        {items.map((item, index) => (
          <div key={item.href}>
            {index > 0 && item.badge === 'separator' && (
              <DropdownMenuSeparator />
            )}
            <DropdownMenuItem asChild>
              <Link
                to={item.href}
                className='flex items-start gap-2 cursor-pointer'>
                {item.icon && <span className='mt-0.5'>{item.icon}</span>}
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <span>{item.label}</span>
                    {item.badge && item.badge !== 'separator' && (
                      <span className='text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded'>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
