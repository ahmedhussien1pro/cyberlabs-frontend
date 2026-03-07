// src/features/website/pages/legal/privacy.tsx
import { useTranslation } from 'react-i18next';
import { LegalLayout } from './legal-layout';

export default function PrivacyPage() {
  const { t } = useTranslation('privacy');

  return (
    <LegalLayout
      namespace='privacy'
      icon='shield'
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
                <li>{t('section2.point5')}</li>
              </ul>
            </>
          ),
        },
        {
          id: 'section3',
          icon: 'document',
          title: t('section3.title'),
          content: (
            <>
              <p className='mb-3'>{t('section3.intro')}</p>
              <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
                <li>{t('section3.point1')}</li>
                <li>{t('section3.point2')}</li>
                <li>{t('section3.point3')}</li>
                <li>{t('section3.point4')}</li>
              </ul>
            </>
          ),
        },
        {
          id: 'section4',
          icon: 'lock',
          title: t('section4.title'),
          content: <p>{t('section4.content')}</p>,
        },
        {
          id: 'section5',
          icon: 'cookie',
          title: t('section5.title'),
          content: <p>{t('section5.content')}</p>,
        },
        {
          id: 'section6',
          icon: 'shield',
          title: t('section6.title'),
          content: <p>{t('section6.content')}</p>,
        },
        {
          id: 'section7',
          icon: 'user',
          title: t('section7.title'),
          content: (
            <>
              <p className='mb-3'>{t('section7.intro')}</p>
              <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
                <li>{t('section7.point1')}</li>
                <li>{t('section7.point2')}</li>
                <li>{t('section7.point3')}</li>
                <li>{t('section7.point4')}</li>
                <li>{t('section7.point5')}</li>
              </ul>
            </>
          ),
        },
        {
          id: 'section8',
          icon: 'document',
          title: t('section8.title'),
          content: (
            <>
              <p className='mb-2'>{t('section8.content')}</p>
              <p>
                Email:{' '}
                <a
                  href='mailto:privacy@cyberlabs.io'
                  className='text-primary hover:underline'>
                  privacy@cyberlabs.io
                </a>
              </p>
            </>
          ),
        },
        {
          id: 'section9',
          icon: 'shield',
          title: t('section9.title'),
          content: <p>{t('section9.content')}</p>,
        },
        {
          id: 'section10',
          icon: 'user',
          title: t('section10.title'),
          content: <p>{t('section10.content')}</p>,
        },
      ]}
    />
  );
}
