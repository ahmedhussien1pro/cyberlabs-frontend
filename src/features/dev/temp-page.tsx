import { HeroSection } from '../landing/components';
import MainLayout from '@/shared/components/layout/main-layout';
export default function TempPage() {
  return (
    <MainLayout>
      <HeroSection />
      <div className='w-2/3 m-auto mt-2'>
        <h1>Hello this is test page</h1>
      </div>
    </MainLayout>
  );
}
