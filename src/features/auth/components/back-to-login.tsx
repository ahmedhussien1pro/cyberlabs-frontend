import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';

export function BackToLogin() {
  return (
    <div className='flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-primary transition-colors'>
      <ArrowLeft size={16} />
      <Link to={ROUTES.AUTH.LOGIN} className='font-medium'>
        Back to Login
      </Link>
    </div>
  );
}
