import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Clock } from 'lucide-react';
import { ContactHeader } from '@/features/contact/components/contact-header';
import { ContactInfoCard } from '@/features/contact/components/contact-info-card';
import { ContactTerminal } from '@/features/contact/components/contact-terminal';
import { ContactForm } from '@/features/contact/components/contact-form';

export default function ContactContainer() {
  const { t } = useTranslation('contact');

  const infoItems = [
    {
      icon: Mail,
      label: t('info.emailLabel'),
      value: t('info.emailValue'),
      delay: 0.1,
    },
    {
      icon: MapPin,
      label: t('info.locationLabel'),
      value: t('info.locationValue'),
      delay: 0.2,
    },
    {
      icon: Clock,
      label: t('info.responseLabel'),
      value: t('info.responseValue'),
      delay: 0.3,
    },
  ];

  return (
    <div className='relative min-h-screen overflow-hidden bg-background'>
      <div className='container py-6 md:py-10'>
        <ContactHeader />

        <div className='grid gap-8 lg:grid-cols-[1fr_2fr] mt-2'>
          {/* Left sidebar */}
          <div className='space-y-4'>
            {infoItems.map((item) => (
              <ContactInfoCard key={item.label} {...item} />
            ))}
            <ContactTerminal />
          </div>

          {/* Right: Form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className='rounded-2xl border border-white/5 bg-card p-6 shadow-lg md:p-8'>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
