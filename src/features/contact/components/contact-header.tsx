import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function ContactHeader() {
  const { t } = useTranslation('contact');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-6'>
      <p className='flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary'>
        <span className='h-px w-6 bg-primary' />
        {t('label')}
        {/* <span className='h-px w-6 bg-primary' /> */}
      </p>
      <h1 className='text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl'>
        {t('title')}
      </h1>
      <p className='text-base leading-relaxed text-muted-foreground mt-2'>
        {t('subtitle')}
      </p>
    </motion.div>
  );
}
