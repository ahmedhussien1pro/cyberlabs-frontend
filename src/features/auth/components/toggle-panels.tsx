import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface TogglePanelsProps {
  isActive: boolean;
  onToggle: () => void;
}

export function TogglePanels({ isActive, onToggle }: TogglePanelsProps) {
  return (
    <div className='auth-page__toggle-box hidden md:block'>
      <motion.div
        className='auth-page__toggle-panel auth-page__toggle-panel--left'
        initial={{ x: 0 }}
        animate={{ x: isActive ? '-100%' : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}>
        <h1 className='auth-page__toggle-heading'>Hello, Welcome!</h1>
        <p className='auth-page__toggle-text'>Don't have an account?</p>
        <Button
          onClick={onToggle}
          variant='outline'
          className='auth-page__toggle-btn'
          type='button'>
          Register Now
        </Button>
      </motion.div>

      <motion.div
        className='auth-page__toggle-panel auth-page__toggle-panel--right'
        initial={{ x: '100%' }}
        animate={{ x: isActive ? 0 : '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}>
        <h1 className='auth-page__toggle-heading'>Welcome Back!</h1>
        <p className='auth-page__toggle-text'>Already have an account?</p>
        <Button
          onClick={onToggle}
          variant='outline'
          className='auth-page__toggle-btn'
          type='button'>
          Sign In
        </Button>
      </motion.div>
    </div>
  );
}
