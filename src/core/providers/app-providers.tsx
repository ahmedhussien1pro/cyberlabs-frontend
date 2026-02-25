import type { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { I18nProvider } from './i18n-provider';
import { QueryProvider } from './query-provider';
import { Toaster } from '@/components/ui/sonner';
import { SocketProvider } from './socket-provider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryProvider>
          <SocketProvider>
            {children}
            <Toaster richColors closeButton position='top-right' />
          </SocketProvider>
        </QueryProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
