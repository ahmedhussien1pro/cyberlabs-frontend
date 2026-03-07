// src/features/profile/components/profile-header/profile-avatar.tsx
import { useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUploadAvatar } from '../../hooks/use-update-profile';

interface Props {
  name: string;
  avatarUrl?: string;
  level?: number;
  editable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE = {
  sm: 'h-16 w-16',
  md: 'h-20 w-20 md:h-28 md:w-28',
  lg: 'h-32 w-32',
};

export function ProfileAvatar({
  name,
  avatarUrl,
  level,
  editable,
  size = 'md',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadAvatar();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    // Reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  return (
    <div className='relative inline-block'>
      <Avatar className={`${SIZE[size]} border-4 border-card shadow-xl`}>
        {/*
         * key={avatarUrl} is CRITICAL.
         *
         * Radix UI Avatar stores image-load state internally. Once it enters
         * "fallback" mode (src was empty or failed), it will NOT retry even
         * if the `src` prop later changes to a valid URL.
         *
         * Passing a changing `key` forces React to fully unmount and remount
         * the AvatarImage, resetting Radix's internal state so the new URL
         * is fetched and displayed correctly after an avatar upload.
         */}
        <AvatarImage
          key={avatarUrl ?? '__fallback__'}
          src={avatarUrl ?? ''}
          alt={name}
        />
        <AvatarFallback className='bg-primary/10 text-2xl font-bold text-primary'>
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Level badge */}
      {level !== undefined && (
        <div
          className='absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center
                     rounded-full border-2 border-card bg-primary text-[10px] font-black
                     text-primary-foreground shadow-md'
        >
          {level}
        </div>
      )}

      {/* Editable overlay */}
      {editable && (
        <>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className='absolute inset-0 flex items-center justify-center rounded-full
                       bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100
                       disabled:cursor-not-allowed'
          >
            {isPending ? (
              <Loader2 className='h-6 w-6 animate-spin text-white' />
            ) : (
              <Camera className='h-6 w-6 text-white' />
            )}
          </button>
          <input
            ref={inputRef}
            type='file'
            accept='image/jpeg,image/png,image/webp'
            className='hidden'
            onChange={handleFile}
          />
        </>
      )}
    </div>
  );
}
