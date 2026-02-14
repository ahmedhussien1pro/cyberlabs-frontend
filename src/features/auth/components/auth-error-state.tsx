import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AuthErrorStateProps {
  title?: string;
  message: string;
  retryText?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  variant?: 'error' | 'warning' | 'info';
}

export function AuthErrorState({
  title = 'Error',
  message,
  retryText = 'Try Again',
  onRetry,
  showRetry = true,
  variant = 'error',
}: AuthErrorStateProps) {
  const alertVariant = variant === 'error' ? 'destructive' : 'default';

  return (
    <div className='space-y-4'>
      <Alert variant={alertVariant}>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>

      {showRetry && onRetry && (
        <Button onClick={onRetry} variant='outline' className='w-full'>
          <RefreshCw className='mr-2 h-4 w-4' />
          {retryText}
        </Button>
      )}
    </div>
  );
}
