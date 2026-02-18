// src/shared/components/common/preloader.tsx
import { motion } from 'framer-motion';
import { LOGO_DARK, LOGO_WHITE } from '@/shared/constants/constants';

export function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm'>
      <div className='relative w-36 h-36'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className='absolute inset-0 rounded-full border-2 border-transparent border-r-primary border-b-primary'
        />

        <div className='absolute inset-0 flex items-center justify-center'>
          <img
            src={LOGO_WHITE}
            alt='CyberLabs'
            className='w-24 h-auto object-contain block dark:hidden'
          />
          <img
            src={LOGO_DARK}
            alt='CyberLabs'
            className='w-24 h-auto object-contain hidden dark:block'
          />
        </div>
      </div>
    </motion.div>
  );
}
