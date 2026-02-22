import type {
  Notification,
  NotificationsResponse,
} from '../types/notification.types';

const T = (minutesAgo: number) =>
  new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'mock-1',
    type: 'SYSTEM',
    title: 'مرحباً بك في CyberLabs! 🎉',
    body: 'حسابك جاهز، ابدأ بأول مختبر الآن واكسب XP.',
    isRead: false,
    isArchived: false,
    createdAt: T(3),
  },
  {
    id: 'mock-2',
    type: 'ACHIEVEMENT',
    title: 'تم فتح إنجاز جديد!',
    body: 'حصلت على شارة "First Blood" لإكمال أول مختبر.',
    isRead: false,
    isArchived: false,
    createdAt: T(90),
    meta: { badge: 'First Blood', xp: 100 },
  },
  {
    id: 'mock-3',
    type: 'LEVEL_UP',
    title: 'Level Up! ⚡ المستوى 2',
    body: 'وصلت للمستوى الثاني، استمر وأنت في تقدم رائع.',
    isRead: false,
    isArchived: false,
    createdAt: T(60 * 5),
    meta: { level: 2 },
  },
  {
    id: 'mock-4',
    type: 'LAB',
    title: 'مختبر جديد متاح',
    body: 'تم إضافة مختبر "SQL Injection Basics" — جربه الآن.',
    isRead: true,
    isArchived: false,
    createdAt: T(60 * 24),
  },
  {
    id: 'mock-5',
    type: 'COURSE',
    title: 'كورس جديد: Web Security 101',
    body: 'كورس مقدمة في أمان الويب متاح الآن للتسجيل.',
    isRead: true,
    isArchived: false,
    createdAt: T(60 * 48),
  },
  {
    id: 'mock-6',
    type: 'MESSAGE',
    title: 'رسالة من فريق CyberLabs',
    body: 'شكراً لانضمامك! نحن هنا لمساعدتك في رحلة الأمن السيبراني.',
    isRead: true,
    isArchived: true,
    createdAt: T(60 * 72),
  },
];

export const MOCK_NOTIFICATIONS_RESPONSE: NotificationsResponse = {
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.isRead && !n.isArchived)
    .length,
  total: MOCK_NOTIFICATIONS.length,
};
