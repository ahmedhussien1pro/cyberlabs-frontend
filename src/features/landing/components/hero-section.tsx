// src/features/landing/components/hero-section.tsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ParticlesBackground } from './particles-background';
import { ROUTES } from '@/shared/constants';
import { landingImage } from '@/shared/constants/constants';
import '../styles/landing.css';

export function HeroSection() {
  const { t } = useTranslation('landing');

  return (
    <section className='relative overflow-hidden min-h-[65vh] flex items-center font-sans px-10'>
      {/* Particles Background */}
      <ParticlesBackground />

      <div className='container relative z-10 py-5 mx-auto px-10'>
        <div className='flex flex-col lg:flex-row items-center gap-10'>
          {/* Text Side */}
          <motion.div
            className='flex-1 space-y-6'
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}>
            {/* Header */}
            <h3 className='landing-text__header text-[2.25rem] font-medium capitalize relative ps-8'>
              {t('hero.header')}
            </h3>

            {/* Headline */}
            <h1 className='text-[2rem] font-bold leading-snug capitalize bg-gradient-to-r from-primary to-[#00c4ff] bg-clip-text text-transparent'>
              {t('hero.headline')}
            </h1>

            {/* Description */}
            <p className='text-base leading-relaxed text-muted-foreground'>
              {t('hero.description')}
            </p>

            {/* CTAs */}
            <div className='flex flex-wrap items-center gap-4 pt-2'>
              <Button asChild className='rounded-full px-6 py-3 font-semibold'>
                <Link to={ROUTES.HOME}>{t('hero.cta')}</Link>
              </Button>

              <Link
                to='#'
                className='flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors'>
                <Play size={16} fill='currentColor' />
                {t('hero.demo')}
              </Link>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            className='flex-1 text-center hidden sm:block'
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <img
              src={landingImage}
              alt='Cybersecurity Banner'
              className='w-4/5 max-w-[400px] mx-auto animate-bounce-slow'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
