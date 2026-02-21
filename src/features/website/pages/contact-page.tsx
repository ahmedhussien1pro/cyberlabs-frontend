import ContactContainer from '@/features/contact/components/contact-container';
import Navbar from '@/shared/components/layout/navbar';
import Footer from '@/shared/components/layout/footer';

export default function ContactPage() {
  return (
    <div>
      <Navbar />
      <ContactContainer />
      <Footer />
    </div>
  );
}
