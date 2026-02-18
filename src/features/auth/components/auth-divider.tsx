import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text }: AuthDividerProps) {
  const { t } = useTranslation('auth');

  const displayText = text ?? t('common.or');

  return (
    <div className='flex items-center gap-2 my-6'>
      <Separator className='flex-1' />
      <span className='px-2 text-muted-foreground text-sm'>{displayText}</span>
      <Separator className='flex-1' />
    </div>
  );
}
