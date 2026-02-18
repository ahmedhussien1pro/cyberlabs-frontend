import { motion } from 'framer-motion';

export function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
      <div className='relative'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full'
        />
        <div className='mt-4 text-center font-semibold text-primary'>
          Loading...
        </div>
      </div>
    </motion.div>
  );
}
