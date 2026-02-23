import type { Course, PaginatedCourses } from '../types/course.types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    slug: 'careers-in-cyber',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
    favorite: false,
    myCourses: false,
    status: 'published',
    access: 'free',
    en_data: {
      category: 'Career & Industry',
      title: 'Careers in Cyber',
      description:
        'Discover diverse cybersecurity careers, essential skills, and industry opportunities.',
      topics: [
        'Overview of Cyber Careers',
        'Educational Paths',
        'Industry Certifications',
        'Job Market Trends',
      ],
      difficulty: 'Beginner',
      state: 'pending',
    },
    ar_data: {
      category: 'المهنة والصناعة',
      title: 'المهن في الأمن السيبراني',
      description:
        'اكتشف مسارات مهنية متنوعة في الأمن السيبراني والمهارات الأساسية.',
      topics: [
        'نظرة عامة على وظائف الأمن',
        'المسارات التعليمية',
        'الشهادات الصناعية',
        'اتجاهات سوق العمل',
      ],
      difficulty: 'مبتدئ',
      state: 'قيد الانتظار',
    },
    estimatedHours: 4,
    enrolledCount: 1240,
    totalLabs: 3,
  },
  {
    id: 'c2',
    slug: 'linux-fundamentals',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400',
    favorite: false,
    myCourses: false,
    status: 'published',
    access: 'free',
    en_data: {
      category: 'Fundamentals',
      title: 'Linux Fundamentals',
      description:
        'Learn the Linux operating system from the ground up for cybersecurity.',
      topics: ['CLI Basics', 'File System', 'Permissions', 'Scripting'],
      difficulty: 'Beginner',
      state: 'available',
    },
    ar_data: {
      category: 'الأساسيات',
      title: 'أساسيات لينكس',
      description: 'تعلم نظام تشغيل لينكس من الأساس للأمن السيبراني.',
      topics: ['أساسيات CLI', 'نظام الملفات', 'الصلاحيات', 'السكريبتات'],
      difficulty: 'مبتدئ',
      state: 'متاح',
    },
    estimatedHours: 8,
    enrolledCount: 3200,
    totalLabs: 6,
  },
  {
    id: 'c3',
    slug: 'network-fundamentals',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
    favorite: false,
    myCourses: false,
    status: 'published',
    access: 'pro',
    en_data: {
      category: 'Networking',
      title: 'Network Fundamentals',
      description:
        'Understand networking concepts essential for every security professional.',
      topics: ['OSI Model', 'TCP/IP', 'DNS & HTTP', 'Firewalls'],
      difficulty: 'Intermediate',
      state: 'available',
    },
    ar_data: {
      category: 'الشبكات',
      title: 'أساسيات الشبكات',
      description: 'افهم مفاهيم الشبكات الأساسية لكل متخصص في الأمن.',
      topics: ['نموذج OSI', 'TCP/IP', 'DNS و HTTP', 'جدران الحماية'],
      difficulty: 'متوسط',
      state: 'متاح',
    },
    estimatedHours: 10,
    enrolledCount: 2100,
    totalLabs: 8,
  },
];

export const MOCK_COURSES_RESPONSE: PaginatedCourses = {
  data: MOCK_COURSES,
  meta: { total: 3, page: 1, limit: 12, totalPages: 1 },
};
