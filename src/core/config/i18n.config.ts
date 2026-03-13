import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],

    ns: [
      'common',
      'translation',
      'auth',
      'landing',
      'footer',
      'forgotPassword',
      'verifyEmail',
      'oauthCallback',
      'resetPassword',
      'otpVerification',
      'notifications',
      'logout',
      'language',
      'terms',
      'privacy',
      'dashboard',
      'errors',
      'profile',
      'settings',
      'courses',
      'paths',
      // ✅ added missing namespaces
      'search',
      'labs',
      'challenges',
      'pricing',
    ],
    defaultNS: 'common',

    debug: import.meta.env.DEV,

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
