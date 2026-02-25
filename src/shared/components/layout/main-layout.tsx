import type { ReactNode } from 'react';
import { Footer } from './footer';
import Navbar from './navbar';
import { useNotificationListener } from '@/features/notifications/hooks/use-notification-listener';
import { Toaster } from '@/components/ui/sonner';

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
      <Toaster richColors closeButton position='top-right' />
    </div>
  );
}

export default MainLayout;
