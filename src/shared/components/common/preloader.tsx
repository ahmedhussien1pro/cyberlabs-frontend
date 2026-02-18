// src/shared/components/preloader.tsx
import { motion } from 'framer-motion';
import { LOGO_DARK, LOGO_WHITE } from '@/shared/constants/constants';

export function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-4'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full'
        />
        <img
          src={LOGO_WHITE}
          alt='CyberLabs Logo'
          className='w-20 h-auto object-contain block dark:hidden'
        />
        <img
          src={LOGO_DARK}
          alt='CyberLabs Logo'
          className='w-20 h-auto object-contain hidden dark:block'
        />
      </div>
    </motion.div>
  );
}
