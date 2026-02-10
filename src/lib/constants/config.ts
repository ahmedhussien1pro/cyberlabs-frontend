export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    'https://cyberlabs-backend-v1.vercel.app/api/v1',
  TIMEOUT: 30000,
} as const;
export const APP_CONFIG = {
  APP_NAME: 'CyberLabs',
  ITEMS_PER_PAGE: 12,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user-storage',
  THEME: 'theme-storage',
  LANGUAGE: 'language-storage',
} as const;
