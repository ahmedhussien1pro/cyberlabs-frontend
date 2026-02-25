import type { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { I18nProvider } from './i18n-provider';
import { QueryProvider } from './query-provider';
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
          </SocketProvider>
        </QueryProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
