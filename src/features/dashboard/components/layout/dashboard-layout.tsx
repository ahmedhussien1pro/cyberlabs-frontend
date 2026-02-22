import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardTopbar } from './dashboard-topbar';

export default function DashboardLayout(): React.ReactElement {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Desktop sidebar */}
      <div className='hidden md:flex'>
        <DashboardSidebar />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side='left' className='w-60 p-0'>
          <DashboardSidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        <DashboardTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className='flex-1 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
