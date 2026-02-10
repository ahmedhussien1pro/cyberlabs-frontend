import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar/Sidebar';

export const DashboardLayout = () => {
  return (
    <div className='flex min-h-[calc(100vh-4rem)]'>
      <Sidebar />
      <main className='flex-1 p-6 lg:p-8'>
        <Outlet />
      </main>
    </div>
  );
};
