import type { ReactNode } from 'react';
import { Footer } from './footer';
import Navbar from './navbar';
import { useNotificationListener } from '@/features/notifications/hooks/use-notification-listener';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // Activate global notification listener
  useNotificationListener();

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
