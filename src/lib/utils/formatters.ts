import { format, formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

const locales = { ar, en: enUS };

export const formatDate = (
  date: string | Date,
  formatStr: string = 'PPP',
  locale: 'ar' | 'en' = 'en',
) => {
  return format(new Date(date), formatStr, { locale: locales[locale] });
};

export const formatRelativeTime = (
  date: string | Date,
  locale: 'ar' | 'en' = 'en',
) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locales[locale],
  });
};

export const formatNumber = (num: number, locale: 'ar' | 'en' = 'en') => {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US').format(num);
};

export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: 'ar' | 'en' = 'en',
) => {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value: number, locale: 'ar' | 'en' = 'en') => {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
};
