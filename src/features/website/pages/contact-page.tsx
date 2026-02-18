import Navbar from '@/shared/components/layout/navbar';
import Footer from '@/shared/components/layout/footer';
export default function ContactPage() {
  return (
    <div>
      <Navbar />
      <div className='container mx-auto px-4 py-16'>
        <h1 className='text-4xl font-bold'>Contact Page</h1>
        <p className='mt-4 text-muted-foreground'>
          Contact page coming soon...
        </p>
      </div>
      <Footer />
    </div>
  );
}
