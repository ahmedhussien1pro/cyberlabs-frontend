// src/features/courses/pages/course-details-page.tsx
import { CourseLanding } from '@/shared/components/common/landing';
export default function CourseDetailsPage() {
  const courseData = {
    title: {
      en: 'Red Team Fundamentals',
      ar: 'أساسيات الفريق الأحمر',
    },
    description: {
      en: 'Learn offensive security tactics...',
      ar: 'تعلم تكتيكات الأمن الهجومي...',
    },
    difficulty: { en: 'Intermediate', ar: 'متوسط' },
    duration: { en: '30 min', ar: '30 دقيقة' },
    courseImage: '/images/courses/red-team.png',
    instructor: 'CyberLabs',
    rating: 4.8,
    students: 2543,
  };

  return (
    <div>
      <CourseLanding
        {...courseData}
        onStartLearning={() => navigate('/course/start')}
        onSave={async () => await saveCourse(courseId)}
        onFavorite={async () => await toggleFavorite(courseId)}
      />
      {/* Rest of course content */}
    </div>
  );
}
