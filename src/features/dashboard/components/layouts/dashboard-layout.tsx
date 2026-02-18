// src/features/dashboard/components/layout/dashboard-layout.tsx

import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { useDashboardStore } from '../../store/dashboard.store';
import { useDashboardShortcuts } from '../../hooks';
import { cn } from '@/shared/utils';

export function DashboardLayout() {
  const { sidebarCollapsed } = useDashboardStore();
  useDashboardShortcuts();

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto',
            'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
          )}>
          <div className='container max-w-7xl px-4 py-6 md:px-6'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
