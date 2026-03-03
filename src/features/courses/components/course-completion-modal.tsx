import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Trophy, Sparkles, X, BookOpen, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ✅ Confetti ثابت على مستوى الـ module — بدون Math.random في الـ render
const COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
];
const CONFETTI = Array.from({ length: 32 }, (_, i) => ({
  color: COLORS[i % COLORS.length],
  left: `${(i * 3.23) % 100}%`,
  delay: `${(i * 0.038) % 1.2}s`,
  dur: `${1.6 + (i % 5) * 0.28}s`,
  size: `${6 + (i % 4) * 2}px`,
  round: i % 2 === 0,
}));

interface Props {
  open: boolean;
  courseTitle: string;
  onClose: () => void;
  /** بعد الـ reset: يرجع الكورس لحالة غير مكتملة */
  onReset?: () => void;
}

export function CourseCompletionModal({
  open,
  courseTitle,
  onClose,
  onReset,
}: Props) {
  const { t } = useTranslation('courses');

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleReset = () => {
    onReset?.();
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { opacity:1; transform:translateY(0) rotate(0deg) scale(1); }
          100% { opacity:0; transform:translateY(360px) rotate(720deg) scale(0.4); }
        }
      `}</style>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key='backdrop'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm'
              onClick={onClose}
            />

            {/* Modal */}
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'>
              <motion.div
                key='modal'
                initial={{ opacity: 0, scale: 0.75, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className='relative w-full max-w-md rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden pointer-events-auto'
                onClick={(e) => e.stopPropagation()}>
                {/* Confetti */}
                <div
                  className='pointer-events-none absolute inset-0 overflow-hidden rounded-2xl'
                  aria-hidden>
                  {CONFETTI.map((p, i) => (
                    <span
                      key={i}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: p.round ? '50%' : '2px',
                        animation: `confetti-fall ${p.dur} ${p.delay} ease-in forwards`,
                        opacity: 0,
                      }}
                    />
                  ))}
                </div>

                {/* Close */}
                <button
                  onClick={onClose}
                  className='absolute top-3 end-3 z-10 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'>
                  <X className='h-4 w-4' />
                </button>

                {/* Content */}
                <div className='relative z-10 flex flex-col items-center gap-5 px-8 py-10 text-center'>
                  {/* Trophy */}
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.15,
                      type: 'spring',
                      stiffness: 250,
                      damping: 14,
                    }}>
                    <div className='flex h-24 w-24 items-center justify-center rounded-full border-4 border-yellow-500/40 bg-yellow-500/10 shadow-xl shadow-yellow-500/20'>
                      <Trophy className='h-12 w-12 text-yellow-400' />
                    </div>
                  </motion.div>

                  {/* Stars */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='flex gap-1.5'>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.1, type: 'spring' }}>
                        <Sparkles className='h-5 w-5 text-yellow-400' />
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Texts */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42 }}
                    className='space-y-2'>
                    <h2 className='text-2xl font-black text-foreground'>
                      🎉 {t('completion.congrats', 'Course Completed!')}
                    </h2>
                    <p className='text-muted-foreground text-sm'>
                      {t(
                        'completion.finished',
                        'You have successfully finished',
                      )}
                    </p>
                    <p className='font-bold text-primary'>{courseTitle}</p>
                  </motion.div>

                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.52 }}
                    className='flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400'>
                    <BookOpen className='h-4 w-4' />
                    {t(
                      'completion.addedToStack',
                      'Added to your achievements!',
                    )}
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.62 }}
                    className='flex gap-3 w-full'>
                    {/*
                     * ✅ Reset Progress — يبدأ من جديد
                     * disabled لو مفيش onReset (مش موجود سياق للـ reset)
                     */}
                    {onReset ? (
                      <Button
                        variant='outline'
                        size='sm'
                        className={cn(
                          'flex-1 gap-2',
                          'border-orange-500/30 text-orange-400',
                          'hover:bg-orange-500/10 hover:border-orange-500/50',
                        )}
                        onClick={handleReset}>
                        <RotateCcw className='h-3.5 w-3.5' />
                        {t('completion.reset', 'Reset Progress')}
                      </Button>
                    ) : (
                      <Button
                        variant='outline'
                        size='sm'
                        disabled
                        className='flex-1 cursor-not-allowed opacity-40 border-emerald-500/20 text-emerald-400'>
                        ✓ {t('completion.allDone', 'All Done!')}
                      </Button>
                    )}

                    <Button size='sm' className='flex-1' onClick={onClose}>
                      {t('completion.close', 'Close')}
                    </Button>
                  </motion.div>

                  {/* تحذير صغير تحت الـ Reset */}
                  {onReset && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.72 }}
                      className='text-[11px] text-muted-foreground/60'>
                      {t(
                        'completion.resetNote',
                        'Reset clears local progress only',
                      )}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
