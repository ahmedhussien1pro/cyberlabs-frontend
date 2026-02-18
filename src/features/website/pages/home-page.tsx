// src/features/website/pages/home-page.tsx
import {
  LearnLanding,
  PracticeLanding,
  CourseLanding,
  HomeLanding,
} from '@/shared/components/common';
import { StatsSection } from '@/shared/components/common';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Image from '/assets/images/placeholder-course.png';
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
  const navigate = useNavigate();
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
      <Navbar />
      <HomeLanding />
      <LearnLanding
        onStartLearning={() => navigate('/courses')}
        courseImage={Image}
      />
      <PracticeLanding onTryLab={() => navigate('/labs')} />
      <CourseLanding
        {...courseData}
        onStartLearning={() => navigate('/course/start')}
        onSave={async () => await saveCourse(courseId)}
        onFavorite={async () => await toggleFavorite(courseId)}
      />
      <StatsSection />
      <Footer />
      {/* Other sections */}
    </div>
  );
}
