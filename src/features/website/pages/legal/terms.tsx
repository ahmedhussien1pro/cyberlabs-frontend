// src/features/website/pages/legal/terms.tsx
import { useTranslation } from 'react-i18next';
import { LegalLayout } from './legal-layout';

export default function TermsPage() {
  const { t } = useTranslation('terms');

  return (
    <LegalLayout
      namespace='terms'
      icon='scale'
      sections={[
        {
          id: 'section1',
          icon: 'document',
          title: t('section1.title'),
          content: <p>{t('section1.content')}</p>,
        },
        {
          id: 'section2',
          icon: 'user',
          title: t('section2.title'),
          content: (
            <>
              <p className='mb-3'>{t('section2.intro')}</p>
              <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
                <li>{t('section2.point1')}</li>
                <li>{t('section2.point2')}</li>
                <li>{t('section2.point3')}</li>
                <li>{t('section2.point4')}</li>
              </ul>
            </>
          ),
        },
        {
          id: 'section3',
          icon: 'shield',
          title: t('section3.title'),
          content: (
            <>
              <p className='mb-3'>{t('section3.intro')}</p>
              <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
                <li>{t('section3.point1')}</li>
                <li>{t('section3.point2')}</li>
                <li>{t('section3.point3')}</li>
                <li>{t('section3.point4')}</li>
                <li>{t('section3.point5')}</li>
              </ul>
            </>
          ),
        },
        {
          id: 'section4',
          icon: 'document',
          title: t('section4.title'),
          content: <p>{t('section4.content')}</p>,
        },
        {
          id: 'section5',
          icon: 'scale',
          title: t('section5.title'),
          content: <p>{t('section5.content')}</p>,
        },
        {
          id: 'section6',
          icon: 'document',
          title: t('section6.title'),
          content: <p>{t('section6.content')}</p>,
        },
        {
          id: 'section7',
          icon: 'document',
          title: t('section7.title'),
          content: (
            <>
              <p className='mb-2'>{t('section7.content')}</p>
              <p>
                Email:{' '}
                <a
                  href='mailto:support@cyberlabs.io'
                  className='text-primary hover:underline'>
                  support@cyberlabs.io
                </a>
              </p>
            </>
          ),
        },
        {
          id: 'section8',
          icon: 'document',
          title: t('section8.title'),
          content: <p>{t('section8.content')}</p>,
        },
        {
          id: 'section9',
          icon: 'scale',
          title: t('section9.title'),
          content: <p>{t('section9.content')}</p>,
        },
      ]}
    />
  );
}
