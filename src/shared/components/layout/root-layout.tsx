import { Outlet } from 'react-router';
import { useInactivityLogout } from '@/features/auth/hooks/use-inactivity-logout';
export default function RootLayout() {
  useInactivityLogout();
  return (
    <div className='app'>
      <Outlet />
    </div>
  );
}
