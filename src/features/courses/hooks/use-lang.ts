// src/features/courses/hooks/use-lang.ts
import { useTranslation } from 'react-i18next';

export type Lang = 'en' | 'ar';

/**
 * Returns the current UI language as a typed 'en' | 'ar' value.
 * Replaces the repeated `i18n.language === 'ar' ? 'ar' : 'en'` pattern.
 */
export function useLang(): Lang {
  const { i18n } = useTranslation();
  return i18n.language === 'ar' ? 'ar' : 'en';
}
