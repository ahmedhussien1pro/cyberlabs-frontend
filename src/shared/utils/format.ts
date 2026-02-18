import { format as dateFnsFormat, formatDistance } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

export const format = {
  date(
    date: Date | string | number,
    pattern: string = 'PPP',
    locale: 'en' | 'ar' = 'en',
  ): string {
    const dateObj =
      typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;
    const localeObj = locale === 'ar' ? ar : enUS;

    return dateFnsFormat(dateObj, pattern, { locale: localeObj });
  },

  dateRelative(
    date: Date | string | number,
    locale: 'en' | 'ar' = 'en',
  ): string {
    const dateObj =
      typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;
    const localeObj = locale === 'ar' ? ar : enUS;

    return formatDistance(dateObj, new Date(), {
      addSuffix: true,
      locale: localeObj,
    });
  },

  number(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  },

  currency(
    value: number,
    currency: string = 'USD',
    locale: string = 'en-US',
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  },

  percentage(value: number, decimals: number = 0): string {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  fileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  truncate(text: string, length: number = 100, suffix: string = '...'): string {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
  },
};

export default format;
