import { useRef, useState } from 'react';
import { Camera, Loader2, Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useUploadAvatar } from '../../hooks/use-update-profile';
import { AvatarCropDialog } from './avatar-crop-dialog';

interface Props {
  name: string;
  avatarUrl?: string;
}

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export function EditAvatar({ name, avatarUrl }: Props) {
  const { t } = useTranslation('profile');
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadAvatar();

  const [preview, setPreview] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED.includes(file.type))
      return t('edit.avatarInvalidType');
    if (file.size > MAX_SIZE)
      return t('edit.avatarTooLarge');
    return null;
  };

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onCropComplete = (croppedFile: File) => {
    setCropOpen(false);
    upload(croppedFile);
    setPreview(null);
    setOriginalFile(null);
  };

  const cancelPreview = () => {
    setPreview(null);
    setOriginalFile(null);
    setCropOpen(false);
  };

  return (
    <>
      <div className='flex flex-col items-center gap-4'>
        <div
          className={cn(
            'relative',
            dragActive && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
          )}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}>
          <Avatar className='h-24 w-24 border-4 border-muted shadow-xl'>
            <AvatarImage src={preview ?? avatarUrl ?? ''} alt={name} />
            <AvatarFallback className='bg-primary/10 text-3xl font-bold text-primary'>
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isPending && (
            <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50'>
              <Loader2 className='h-6 w-6 animate-spin text-white' />
            </div>
          )}
          {dragActive && (
            <div className='absolute inset-0 flex items-center justify-center rounded-full bg-primary/20'>
              <Upload className='h-8 w-8 text-primary' />
            </div>
          )}
        </div>

        {isPending && uploadProgress > 0 && (
          <div className='w-full max-w-xs'>
            <Progress value={uploadProgress} className='h-1.5' />
            <p className='mt-1 text-center text-xs text-muted-foreground'>
              {uploadProgress}%
            </p>
          </div>
        )}

        <div className='flex flex-wrap items-center justify-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className='gap-2 rounded-full border-border/40 text-xs hover:border-primary/40'>
            <Camera className='h-3.5 w-3.5' />
            {t('edit.changeAvatar')}
          </Button>

          {preview && (
            <Button
              variant='ghost'
              size='sm'
              onClick={cancelPreview}
              className='gap-1.5 rounded-full text-xs text-muted-foreground'>
              <X className='h-3.5 w-3.5' />
              {t('edit.cancelPreview')}
            </Button>
          )}
        </div>

        <p className='text-center text-xs text-muted-foreground'>
          {t('edit.avatarHint')}
          <br />
          <span className='text-[10px]'>{t('edit.avatarLimits')}</span>
        </p>
      </div>

      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={onFile}
      />

      {preview && originalFile && (
        <AvatarCropDialog
          imageUrl={preview}
          open={cropOpen}
          onClose={cancelPreview}
          onCrop={onCropComplete}
          originalFile={originalFile}
        />
      )}
    </>
  );
}
