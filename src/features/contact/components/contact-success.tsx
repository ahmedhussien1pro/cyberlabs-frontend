import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface Props {
  onReset: () => void;
}

export function ContactSuccess({ onReset }: Props) {
  const { t } = useTranslation('contact');
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className='flex min-h-[420px] flex-col items-center justify-center gap-4 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10'>
        <CheckCircle2 className='h-8 w-8 text-green-400' />
      </div>
      <h3 className='text-xl font-bold text-foreground'>{t('form.success')}</h3>
      <p className='max-w-xs text-sm text-muted-foreground'>
        {t('form.successDesc')}
      </p>
      <Button
        variant='outline'
        className='mt-4 rounded-full border-border/40 hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
        onClick={onReset}>
        {t('form.submit')}
      </Button>
    </motion.div>
  );
}
