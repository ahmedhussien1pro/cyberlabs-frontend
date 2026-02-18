import { useEffect } from 'react';

/**
 * Custom hook to set document title
 * @param title - Page title
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
