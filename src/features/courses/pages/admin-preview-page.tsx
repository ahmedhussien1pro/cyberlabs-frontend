// src/features/courses/pages/admin-preview-page.tsx
// Called from cyberlabs-admin when clicking "Preview" on a course.
// URL format: /admin-preview/courses/:slug?at=<accessToken>&rt=<refreshToken>
// Stores tokens, fetches user, updates auth store, then redirects to /courses/:slug
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { tokenManager } from '@/features/auth/utils';
import { useAuthStore } from '@/core/store';
import { authService } from '@/features/auth/services/auth.service';
import { Preloader } from '@/shared/components/common/preloader';

export default function AdminPreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const at = searchParams.get('at');
    const rt = searchParams.get('rt');

    if (!at || !rt || !slug) {
      setError('Invalid preview link – missing token or slug.');
      return;
    }

    (async () => {
      try {
        // Re-encrypt tokens with this window's own session key
        await tokenManager.setTokens(at, rt);

        // Fetch the authenticated user
        const user = await authService.getCurrentUser();
        if (!user) throw new Error('Could not fetch user profile');

        // Hydrate the auth store so ProtectedRoute passes
        await login(user, { accessToken: at, refreshToken: rt });

        // Redirect to the real course page
        navigate(`/courses/${slug}`, { replace: true });
      } catch (err) {
        console.error('AdminPreview: auth failed', err);
        setError('Preview authentication failed. Please try again from the admin.');
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center p-8">
        <div>
          <p className="text-destructive font-semibold text-lg mb-2">Preview Error</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return <Preloader />;
}
