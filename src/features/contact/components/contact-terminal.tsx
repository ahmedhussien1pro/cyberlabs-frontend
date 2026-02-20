import { motion } from 'framer-motion';

export function ContactTerminal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      dir='ltr'
      className='overflow-hidden rounded-xl border border-border/40 bg-muted/60 backdrop-blur-sm dark:border-primary/20 dark:bg-black/60'>

      {/* Header */}
      <div className='flex items-center gap-2 border-b border-border/30 bg-muted/80 px-4 py-2 dark:border-primary/10 dark:bg-muted/20'>
        <div className='h-2.5 w-2.5 rounded-full bg-red-500/70' />
        <div className='h-2.5 w-2.5 rounded-full bg-yellow-500/70' />
        <div className='h-2.5 w-2.5 rounded-full bg-green-500/70' />
      </div>

      {/* Body */}
      <div className='space-y-1 p-4 font-mono text-xs text-foreground/70'>
        <p>
          <span className='text-foreground/30'>$</span>
          {' ping cyberlabs.io'}
        </p>
        <p className='text-green-600 dark:text-green-400'>PONG — 12ms</p>
        <p>
          <span className='text-foreground/30'>$</span>
          {' status'}
        </p>
        <p className='text-green-600 dark:text-green-400'>
          ● All systems operational
        </p>
        <p className='flex items-center gap-1'>
          <span className='text-foreground/30'>$</span>
          <span className='inline-block h-[12px] w-[6px] translate-y-[1px] animate-[blink_1s_step-end_infinite] bg-primary' />
        </p>
      </div>
    </motion.div>
  );
}
