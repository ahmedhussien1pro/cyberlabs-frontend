import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, ArrowRight } from 'lucide-react';
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
      <ParticlesBackground />

      <div className='container relative z-10 py-5 mx-auto px-10'>
        <div className='flex flex-col lg:flex-row items-center gap-10'>
          {/* Text Side */}
          <motion.div
            className='flex-1 space-y-6'
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}>
            {/* Header — unchanged */}
            <h3 className='landing-text__header text-[2.25rem] font-medium capitalize relative ps-8'>
              {t('hero.header')}
            </h3>

            {/* Headline — unchanged */}
            <h1 className='text-[2rem] font-bold leading-snug capitalize bg-gradient-to-r from-primary to-[#00c4ff] bg-clip-text text-transparent'>
              {t('hero.headline')}
            </h1>

            <p className='text-base leading-relaxed text-muted-foreground'>
              {t('hero.description')}
            </p>

            <div className='flex flex-wrap items-center gap-4 pt-2'>
              {/* Primary CTA */}
              <Button
                asChild
                size='lg'
                className='group gap-2 px-3 font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-primary/40'>
                <Link to={ROUTES.HOME}>
                  {t('hero.cta')}
                  <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1' />
                </Link>
              </Button>

              {/* Watch Demo — outline variant */}
              <Button
                asChild
                size='lg'
                variant='outline'
                className='group gap-3 px-3 font-semibold transition-all duration-300 border-primary/50 hover:text-primary hover:bg-primary/5'>
                <Link to='#'>
                  <span className='flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/40'>
                    <Play className='h-2.5 w-2.5 fill-primary text-primary' />
                  </span>
                  {t('hero.demo')}
                </Link>
              </Button>
            </div>
          </motion.div>

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
