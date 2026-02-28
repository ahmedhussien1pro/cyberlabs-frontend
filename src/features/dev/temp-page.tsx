// import { CourseCurriculumAccordion } from '@/features/courses/components/course-curriculum';
// import contentData from './../courses/data/mock-courses';
// import type { Topic } from '@/core/types/curriculumCourses.types';
// import MainLayout from '@/shared/components/layout/main-layout';
// import UsersPage from '@/shared/components/labs/UsersLab';
import MCQQuiz from "@/shared/components/labs/MCQQuiz";

// import { DownloadCardLab } from "@/shared/components/labs/DownloadCardLab";

import MCQdata from "@/shared/components/labs/MCQdata.json"
export default function TempPage() {
  return (
    // <MainLayout>
    //   <HeroSection />
    //   {/* <div className='w-2/3 m-auto mt-2'>
    //     <CourseCurriculumAccordion
    //       topics={contentData.topics as Topic[]}
    //       imageMap={{}}
    //     />
    //   </div> */}
    // </MainLayout>
    <>
      {/* <UsersPage /> */}
      <MCQQuiz questionsData={MCQdata.questions} />
      {/* <DownloadCardLab title="test" fileUrl="lll" /> */}

    </>
  );
}
