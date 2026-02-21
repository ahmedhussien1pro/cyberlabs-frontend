import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ShareProfileButton({ userId }: { userId: string }) {
  const { t } = useTranslation('profile');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/profile/${userId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success(t('linkCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={handleCopy}
      className='gap-1.5 rounded-full border-border/40 text-xs
                 hover:border-primary/40 hover:bg-primary/5 hover:text-primary
                 transition-all duration-200'>
      {copied ? (
        <>
          <Check className='h-3.5 w-3.5' />
          {t('copied')}
        </>
      ) : (
        <>
          <Share2 className='h-3.5 w-3.5' />
          {t('share')}
        </>
      )}
    </Button>
  );
}
