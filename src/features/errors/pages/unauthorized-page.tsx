// unauthorized-page
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/shared/constants';

export default function UnauthorizedPage() {
  const { t } = useTranslation();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4'>
      <h1 className='text-9xl font-bold text-primary'>401</h1>
      <h2 className='mt-4 text-3xl font-semibold'>Unauthorized Access</h2>
      <p className='mt-4 text-muted-foreground'>
        You do not have permission to access this page.
      </p>
      <Button asChild className='mt-6'>
        <Link to={ROUTES.HOME}>Go Home</Link>
      </Button>
    </div>
  );
}
