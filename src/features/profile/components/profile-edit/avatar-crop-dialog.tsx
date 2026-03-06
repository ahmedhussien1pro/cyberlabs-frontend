import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
  imageUrl: string;
  open: boolean;
  onClose: () => void;
  onCrop: (croppedFile: File) => void;
  originalFile: File;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  fileName: string,
): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2d context');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg', 0.92);
  });
};

export function AvatarCropDialog({
  imageUrl,
  open,
  onClose,
  onCrop,
  originalFile,
}: Props) {
  const { t } = useTranslation('profile');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedFile = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        originalFile.name,
      );
      onCrop(croppedFile);
    } catch (e) {
      console.error('Crop error:', e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('edit.cropAvatar')}</DialogTitle>
        </DialogHeader>

        <div className='relative h-80 w-full overflow-hidden rounded-xl bg-black'>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape='round'
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className='flex items-center gap-3 px-2'>
          <ZoomOut size={16} className='shrink-0 text-muted-foreground' />
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={([v]) => setZoom(v)}
            className='flex-1'
          />
          <ZoomIn size={16} className='shrink-0 text-muted-foreground' />
        </div>

        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={onClose}>
            {t('edit.cancel')}
          </Button>
          <Button onClick={handleCrop}>{t('edit.applyCrop')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
