import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AuthErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AuthErrorBoundary extends Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<AuthErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.NODE_ENV === 'development') {
      console.error('Auth Error Boundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }

    this.props.onError?.(error, errorInfo);

    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }
    if (fallback) {
      return fallback;
    }

    return (
      <div className='min-h-screen flex items-center justify-center p-4 bg-background'>
        <Card className='max-w-md w-full p-6 space-y-6'>
          {/* Error Icon */}
          <div className='flex justify-center'>
            <div className='rounded-full bg-destructive/10 p-4'>
              <AlertTriangle className='h-12 w-12 text-destructive' />
            </div>
          </div>

          {/* Error Title */}
          <div className='text-center space-y-2'>
            <h2 className='text-2xl font-bold'>Something Went Wrong</h2>
            <p className='text-muted-foreground'>
              We encountered an error while processing your request.
            </p>
          </div>

          {/* Error Details (Development Only) */}
          {import.meta.env.NODE_ENV === 'development' && error && (
            <div className='rounded-md bg-destructive/10 p-4 text-sm'>
              <p className='font-semibold text-destructive mb-2'>
                Error Details:
              </p>
              <pre className='text-xs overflow-auto max-h-32'>
                {error.message}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className='space-y-3'>
            <Button
              onClick={this.handleReset}
              className='w-full'
              variant='default'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Try Again
            </Button>

            <Button
              onClick={this.handleReload}
              className='w-full'
              variant='outline'>
              Reload Page
            </Button>

            <Button
              onClick={this.handleGoHome}
              className='w-full'
              variant='ghost'>
              <Home className='mr-2 h-4 w-4' />
              Go to Homepage
            </Button>
          </div>

          {/* Help Text */}
          <p className='text-center text-sm text-muted-foreground'>
            If this problem persists, please contact support.
          </p>
        </Card>
      </div>
    );
  }
}
