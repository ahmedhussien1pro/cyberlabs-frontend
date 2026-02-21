import { useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUploadAvatar } from '../../hooks/use-update-profile';

interface Props {
  name: string;
  avatarUrl?: string;
}

export function EditAvatar({ name, avatarUrl }: Props) {
  const { t } = useTranslation('profile');
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadAvatar();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) upload(f);
    e.target.value = '';
  };

  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='relative'>
        <Avatar className='h-20 w-20 border-4 border-muted shadow-lg'>
          <AvatarImage src={avatarUrl ?? ''} alt={name} />
          <AvatarFallback className='bg-primary/10 text-2xl font-bold text-primary'>
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isPending && (
          <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/40'>
            <Loader2 className='h-5 w-5 animate-spin text-white' />
          </div>
        )}
      </div>
      <Button
        variant='outline'
        size='sm'
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className='gap-2 rounded-full text-xs border-border/40 hover:border-primary/40'>
        <Camera className='h-3.5 w-3.5' />
        {t('edit.changeAvatar')}
      </Button>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={onFile}
      />
    </div>
  );
}
