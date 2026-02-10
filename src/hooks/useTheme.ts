import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, toggleTheme, setTheme };
};
