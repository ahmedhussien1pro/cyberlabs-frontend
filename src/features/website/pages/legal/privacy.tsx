import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/shared/constants';

export default function PrivacyPage() {
  const { t } = useTranslation('privacy');

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 py-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link to={ROUTES.HOME}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              {t('backToHome')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className='container mx-auto px-4 py-12 max-w-4xl'>
        <div className='space-y-8'>
          {/* Title */}
          <div className='space-y-2'>
            <h1 className='text-4xl font-bold'>{t('title')}</h1>
            <p className='text-muted-foreground'>{t('lastUpdated')}</p>
          </div>

          {/* Sections */}
          <Card className='p-6 sm:p-8'>
            <div className='prose prose-slate dark:prose-invert max-w-none space-y-6'>
              {/* 1. Introduction */}
              <section>
                <h2 className='text-2xl font-semibold mb-3'>
                  {t('section1.title')}
                </h2>
                <p className='text-muted-foreground leading-relaxed'>
                  {t('section1.content')}
                </p>
              </section>

              {/* 2. Information We Collect */}
              <section>
                <h2 className='text-2xl font-semibold mb-3'>
                  {t('section2.title')}
                </h2>
                <p className='text-muted-foreground leading-relaxed mb-3'>
                  {t('section2.intro')}
                </p>
                <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
                  <li>{t('section2.point1')}</li>
                  <li>{t('section2.point2')}</li>
                  <li>{t('section2.point3')}</li>
                  <li>{t('section2.point4')}</li>
                </ul>
              </section>

              {/* 3. How We Use Your Information */}
              <section>
                <h2 className='text-2xl font-semibold mb-3'>
                  {t('section3.title')}
                </h2>
                <p className='text-muted-foreground leading-relaxed mb-3'>
                  {t('section3.intro')}
                </p>
                <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
                  <li>{t('section3.point1')}</li>
                  <li>{t('section3.point2')}</li>
                  <li>{t('section3.point3')}</li>
                  <li>{t('section3.point4')}</li>
                </ul>
              </section>

              {/* 4. Data Security */}
              <section>
                <h2 className='text-2xl font-semibold mb-3'>
                  {t('section4.title')}
                </h2>
                <p className='text-muted-foreground leading-relaxed'>
                  {t('section4.content')}
                </p>
              </section>

              {/* 5. Cookies */}
              <section>
                <h2 className='text-2xl font-semibold mb-3'>
                  {t('section5.title')}
                </h2>
                <p className='text-muted-foreground leading-relaxed'>
                  {t('section5.content')}
                </p>
              </section>

              {/* 6. Third-Party Services */}
              <section>
                <h2 className='text-2xl font-semibold mb-3'>
                  {t('section6.title')}
                </h2>
                <p className='text-muted-foreground leading-relaxed'>
                  {t('section6.content')}
                </p>
              </section>

              {/* 7. Your Rights */}
              <section>
                <h2 className='text-2xl font-semibold mb-3'>
                  {t('section7.title')}
                </h2>
                <p className='text-muted-foreground leading-relaxed mb-3'>
                  {t('section7.intro')}
                </p>
                <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
                  <li>{t('section7.point1')}</li>
                  <li>{t('section7.point2')}</li>
                  <li>{t('section7.point3')}</li>
                  <li>{t('section7.point4')}</li>
                </ul>
              </section>

              {/* 8. Contact */}
              <section>
                <h2 className='text-2xl font-semibold mb-3'>
                  {t('section8.title')}
                </h2>
                <p className='text-muted-foreground leading-relaxed'>
                  {t('section8.content')}
                </p>
                <p className='text-muted-foreground mt-2'>
                  Email:{' '}
                  <a
                    href='mailto:privacy@cyberlabs.com'
                    className='text-primary hover:underline'>
                    privacy@cyberlabs.com
                  </a>
                </p>
              </section>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
