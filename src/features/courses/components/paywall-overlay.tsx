import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import type { CourseAccess } from '../types/course.types';

interface PaywallOverlayProps {
  access: CourseAccess;
  courseTitle: string;
  onUpgrade: () => void;
}

export function PaywallOverlay({
  access,
  courseTitle,
  onUpgrade,
}: PaywallOverlayProps) {
  const { t } = useTranslation('courses');
  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] text-center gap-5 py-16 px-6'>
      <div className='h-16 w-16 rounded-2xl bg-muted flex items-center justify-center border border-border/50'>
        <Lock className='h-8 w-8 text-muted-foreground' />
      </div>
      <div className='space-y-2 max-w-sm'>
        <h3 className='text-lg font-bold text-foreground'>
          {t('paywall.title', 'Content Locked')}
        </h3>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          {t(
            'paywall.desc',
            'Upgrade to {{plan}} to unlock "{{course}}" and all premium content.',
            {
              plan: access,
              course: courseTitle,
            },
          )}
        </p>
      </div>
      <Button onClick={onUpgrade} className='min-w-[180px]'>
        {t('paywall.cta', 'Upgrade to {{plan}}', {
          plan: access.toUpperCase(),
        })}
      </Button>
      <p className='text-xs text-muted-foreground'>
        {t('paywall.hint', 'Cancel anytime · Instant access')}
      </p>
    </div>
  );
}
