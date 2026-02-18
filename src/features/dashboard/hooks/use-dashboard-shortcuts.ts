// src/features/dashboard/hooks/use-dashboard-shortcuts.ts

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard keyboard shortcuts
 */
export const useDashboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for quick search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // TODO: Open search modal
      }

      // Ctrl/Cmd + / for shortcuts help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        // TODO: Open shortcuts modal
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
};
