import { ReactNode } from 'react';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Preloader } from '@/components/common/preloader';
import { TogglePanels } from './toggle-panels';

interface AuthLayoutProps {
  children: ReactNode;
  isLoading?: boolean;
  title?: string;
  showTogglePanels?: boolean;
  isActive?: boolean;
  onToggle?: () => void;
}

export function AuthLayout({
  children,
  isLoading = false,
  title = '',
  showTogglePanels = false,
  isActive = false,
  onToggle,
}: AuthLayoutProps) {
  return (
    <>
      {isLoading && <Preloader />}
      <div className='fixed top-4 right-4 z-50'>
        <ThemeToggle />
      </div>
      <section className='auth-page'>
        <div className='auth-page__container'>
          <div className='auth-page__form-side'>
            {title && <h1 className='auth-page__title'>{title}</h1>}
            <div className='auth-page__form-wrapper'>{children}</div>
          </div>
          {showTogglePanels && onToggle && (
            <TogglePanels isActive={isActive} onToggle={onToggle} />
          )}
        </div>
      </section>
    </>
  );
}
