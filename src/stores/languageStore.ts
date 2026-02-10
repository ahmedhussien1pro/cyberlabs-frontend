import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/lib/i18n/config';

type Language = 'en' | 'ar';

interface LanguageStore {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      toggleLanguage: () =>
        set((state) => {
          const newLang = state.language === 'en' ? 'ar' : 'en';
          i18n.changeLanguage(newLang);
          document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = newLang;
          return { language: newLang };
        }),
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        set({ language: lang });
      },
    }),
    {
      name: 'language-storage',
    },
  ),
);
