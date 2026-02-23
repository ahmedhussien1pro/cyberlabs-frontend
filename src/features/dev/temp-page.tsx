import { HeroSection } from '../landing/components';
import { CourseCurriculumAccordion } from '@/features/courses/components/CourseCurriculumAccordion';
import contentData from './../courses/data';
import type { Topic } from '@/core/types/curriculumCourses.types';
import MainLayout from '@/shared/components/layout/main-layout';
export default function TempPage() {
  return (
    <MainLayout>
      <HeroSection />
      <div className='w-2/3 m-auto mt-2'>
        <CourseCurriculumAccordion
          topics={contentData.topics as Topic[]}
          imageMap={{}}
        />
      </div>
    </MainLayout>
  );
}
