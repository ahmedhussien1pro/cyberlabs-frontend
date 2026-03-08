// src/shared/components/layout/nav-dropdown.tsx
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

export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  separator?: boolean;
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

      {/* ✅ Fix: min-w + max-w بدل w-56 الثابت — يتسع للنص العربي */}
      <DropdownMenuContent
        align='start'
        className='min-w-[14rem] w-auto max-w-xs'>
        {items.map((item) => (
          <div key={item.href}>
            {item.separator && <DropdownMenuSeparator />}

            <DropdownMenuItem asChild>
              <Link
                to={item.href}
                className='flex items-start gap-2 cursor-pointer'>
                {item.icon && (
                  <span className='mt-0.5 shrink-0'>{item.icon}</span>
                )}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <span className='truncate'>{item.label}</span>
                    {item.badge && (
                      <span className='text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded shrink-0'>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className='text-xs text-muted-foreground mt-0.5 whitespace-normal'>
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
