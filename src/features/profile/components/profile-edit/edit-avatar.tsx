// src/features/profile/components/profile-edit/edit-avatar.tsx
import { useRef, useState } from 'react';
import { Camera, Loader2, Upload, X, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

  // Local preview state: set when a file is selected/cropped,
  // cleared only AFTER the upload completes (success or error)
  const [preview, setPreview] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imgError, setImgError] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED.includes(file.type)) return t('edit.avatarInvalidType');
    if (file.size > MAX_SIZE) return t('edit.avatarTooLarge');
    return null;
  };

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }
    setOriginalFile(file);
    setImgError(false);
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

  const clearPreview = () => {
    setPreview(null);
    setOriginalFile(null);
    setCropOpen(false);
  };

  const onCropComplete = (croppedFile: File) => {
    setCropOpen(false);
    /**
     * Keep preview visible while uploading — the user sees their new avatar
     * immediately after cropping. Clear it only after the upload settles
     * (success or error) so the transition is seamless.
     */
    upload(croppedFile, {
      onSuccess: () => clearPreview(),
      onError: () => clearPreview(),
    });
  };

  /**
   * The src priority:
   *   1. preview  — base64 of just-cropped image (immediate feedback)
   *   2. avatarUrl — server URL once cache invalidation resolves
   *
   * Using `key={preview ?? avatarUrl}` forces the <img> to re-mount
   * when the URL changes, bypassing any browser in-memory cache.
   */
  const imgSrc = preview ?? avatarUrl ?? '';

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
          onDrop={onDrop}
        >
          <Avatar className='h-24 w-24 border-4 border-muted shadow-xl'>
            {/* key forces React to re-mount when src changes — clears browser cache */}
            <AvatarImage
              key={imgSrc}
              src={imgSrc}
              alt={name}
              onError={() => setImgError(true)}
            />
            <AvatarFallback className='bg-primary/10 text-3xl font-bold text-primary'>
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Upload spinner overlay */}
          {isPending && (
            <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50'>
              <Loader2 className='h-6 w-6 animate-spin text-white' />
            </div>
          )}

          {/* Drag-over overlay */}
          {dragActive && (
            <div className='absolute inset-0 flex items-center justify-center rounded-full bg-primary/20'>
              <Upload className='h-8 w-8 text-primary' />
            </div>
          )}
        </div>

        {/* Image URL error hint */}
        {imgError && avatarUrl && !preview && (
          <p className='flex items-center gap-1 text-xs text-amber-500'>
            <AlertCircle className='h-3 w-3' />
            {t('edit.avatarLoadError') ?? 'Could not load avatar — check R2_PUBLIC_URL'}
          </p>
        )}

        <div className='flex flex-wrap items-center justify-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className='gap-2 rounded-full border-border/40 text-xs hover:border-primary/40'
          >
            <Camera className='h-3.5 w-3.5' />
            {t('edit.changeAvatar')}
          </Button>

          {preview && !isPending && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearPreview}
              className='gap-1.5 rounded-full text-xs text-muted-foreground'
            >
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
        accept='image/jpeg,image/png,image/webp'
        className='hidden'
        onChange={onFile}
      />

      {preview && originalFile && (
        <AvatarCropDialog
          imageUrl={preview}
          open={cropOpen}
          onClose={clearPreview}
          onCrop={onCropComplete}
          originalFile={originalFile}
        />
      )}
    </>
  );
}
