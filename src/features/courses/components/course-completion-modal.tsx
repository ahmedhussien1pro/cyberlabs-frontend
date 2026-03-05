// src/features/courses/components/course-completion-modal.tsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  RotateCcw,
  X,
  Terminal,
  Trophy,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CYBER_COLORS = [
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#3b82f6', // blue
  '#00ff9f', // cyber green
  '#a855f7', // purple
];
const CONFETTI = Array.from({ length: 36 }, (_, i) => ({
  color: CYBER_COLORS[i % CYBER_COLORS.length],
  left: `${(i * 2.85) % 100}%`,
  delay: `${(i * 0.04) % 1.4}s`,
  dur: `${1.5 + (i % 5) * 0.3}s`,
  size: `${4 + (i % 4) * 2}px`,
  round: i % 3 !== 0,
}));

const TERMINAL_LINES = [
  { text: '> Scanning modules...', delay: 0.1 },
  { text: '> All objectives completed [100%]', delay: 0.45 },
  { text: '> Certificate generating...', delay: 0.8 },
  { text: '> STATUS: MISSION_COMPLETE ✓', delay: 1.1, highlight: true },
];

interface Props {
  open: boolean;
  courseTitle: string;
  onClose: () => void;
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
          0%   { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translateY(380px) rotate(720deg) scale(0.3); }
        }
        @keyframes scan-line {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes cyber-pulse {
          0%, 100% { box-shadow: 0 0 8px #10b981, 0 0 20px #10b98140; }
          50%       { box-shadow: 0 0 16px #10b981, 0 0 40px #10b98160; }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes glitch {
          0%   { clip-path: inset(0 0 98% 0); transform: translate(-2px); }
          10%  { clip-path: inset(40% 0 40% 0); transform: translate(2px); }
          20%  { clip-path: inset(80% 0 2% 0); transform: translate(-1px); }
          30%  { clip-path: inset(20% 0 70% 0); transform: translate(1px); }
          40%  { clip-path: inset(60% 0 20% 0); transform: translate(-2px); }
          50%  { clip-path: inset(0 0 0 0); transform: translate(0); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0); }
        }
      `}</style>

      <AnimatePresence>
        {open && (
          <>
            {/* ── Backdrop ──────────────────────────────────────────── */}
            <motion.div
              key='backdrop'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-50 bg-black/85 backdrop-blur-md'
              onClick={onClose}
            />

            {/* ── Modal ─────────────────────────────────────────────── */}
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'>
              <motion.div
                key='modal'
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className={cn(
                  'relative w-full max-w-md rounded-2xl overflow-hidden pointer-events-auto',
                  'bg-zinc-950 border border-emerald-500/30',
                )}
                style={{ animation: 'cyber-pulse 2.5s ease-in-out infinite' }}
                onClick={(e) => e.stopPropagation()}>
                {/* ── Confetti ──────────────────────────────────────── */}
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

                {/* ── Scan line overlay ──────────────────────────────── */}
                <div
                  className='pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl opacity-[0.04]'
                  aria-hidden>
                  <div
                    className='absolute inset-0 w-full h-1 bg-emerald-400'
                    style={{ animation: 'scan-line 4s linear infinite' }}
                  />
                </div>

                {/* ── Grid pattern overlay ────────────────────────── */}
                <div
                  className='pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-[0.03]'
                  style={{
                    backgroundImage:
                      'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                  aria-hidden
                />

                {/* ── Top accent bar ──────────────────────────────── */}
                <div className='relative z-10 flex items-center gap-2 px-4 py-2.5 border-b border-emerald-500/20 bg-emerald-500/5'>
                  <span className='flex gap-1.5'>
                    <span className='h-2.5 w-2.5 rounded-full bg-rose-500/60' />
                    <span className='h-2.5 w-2.5 rounded-full bg-yellow-500/60' />
                    <span className='h-2.5 w-2.5 rounded-full bg-emerald-500/60' />
                  </span>
                  <span className='font-mono text-[11px] text-emerald-400/80 ms-1'>
                    cyberlabs — mission_complete.sh
                  </span>
                  <button
                    onClick={onClose}
                    className='ms-auto rounded p-1 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors'>
                    <X className='h-3.5 w-3.5' />
                  </button>
                </div>

                {/* ── Content ─────────────────────────────────────── */}
                <div className='relative z-10 flex flex-col items-center gap-5 px-7 pt-7 pb-8 text-center'>
                  {/* Trophy icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.15,
                      type: 'spring',
                      stiffness: 220,
                      damping: 12,
                    }}>
                    <div
                      className={cn(
                        'relative flex h-24 w-24 items-center justify-center rounded-full',
                        'border-2 border-emerald-500/50 bg-emerald-500/10',
                      )}>
                      {/* Outer ring */}
                      <div className='absolute inset-0 rounded-full border border-emerald-400/20 scale-110' />
                      <div className='absolute inset-0 rounded-full border border-emerald-400/10 scale-125' />
                      <Trophy className='h-11 w-11 text-emerald-400' />
                      {/* Corner sparks */}
                      {[0, 90, 180, 270].map((deg) => (
                        <Zap
                          key={deg}
                          className='absolute h-3 w-3 text-cyan-400 opacity-70'
                          style={{
                            transform: `rotate(${deg}deg) translateY(-42px)`,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Terminal lines */}
                  <div className='w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-start space-y-1 font-mono'>
                    {TERMINAL_LINES.map((line, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: line.delay, duration: 0.3 }}
                        className={cn(
                          'text-[11px] leading-5',
                          line.highlight
                            ? 'text-emerald-400 font-bold'
                            : 'text-zinc-400',
                        )}>
                        {line.text}
                        {i === TERMINAL_LINES.length - 1 && (
                          <span
                            className='inline-block w-1.5 h-3 bg-emerald-400 ms-0.5 align-middle'
                            style={{
                              animation: 'blink-cursor 1s step-end infinite',
                            }}
                          />
                        )}
                      </motion.p>
                    ))}
                  </div>

                  {/* Main text */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className='space-y-1.5'>
                    <h2 className='text-xl font-black tracking-wide text-white'>
                      {t('completion.congrats', 'Mission Complete!')}
                    </h2>
                    <p className='text-sm text-zinc-400'>
                      {t(
                        'completion.finished',
                        'You have successfully completed',
                      )}
                    </p>
                    <p className='font-bold text-emerald-400 text-sm'>
                      {courseTitle}
                    </p>
                  </motion.div>

                  {/* Achievement badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}>
                    <div className='flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400'>
                      <ShieldCheck className='h-3.5 w-3.5 shrink-0' />
                      {t(
                        'completion.addedToStack',
                        'Added to your achievements',
                      )}
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.65 }}
                    className='flex gap-2.5 w-full'>
                    {onReset ? (
                      <Button
                        variant='outline'
                        size='sm'
                        className={cn(
                          'flex-1 gap-1.5 font-mono text-xs',
                          'border-orange-500/30 bg-orange-500/5 text-orange-400',
                          'hover:bg-orange-500/10 hover:border-orange-500/50',
                        )}
                        onClick={handleReset}>
                        <RotateCcw className='h-3.5 w-3.5' />
                        {t('completion.reset', 'Reset')}
                      </Button>
                    ) : null}

                    <Button
                      size='sm'
                      className={cn(
                        'flex-1 gap-1.5 font-mono text-xs',
                        'bg-emerald-600 hover:bg-emerald-500 text-white border-0',
                        'shadow-lg shadow-emerald-900/40',
                      )}
                      onClick={onClose}>
                      <Terminal className='h-3.5 w-3.5' />
                      {t('completion.close', 'Continue')}
                      <ChevronRight className='h-3 w-3' />
                    </Button>
                  </motion.div>

                  {/* Reset warning */}
                  {onReset && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                      className='font-mono text-[10px] text-zinc-600'>
                      {'>'} reset will clear all completed topics
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
