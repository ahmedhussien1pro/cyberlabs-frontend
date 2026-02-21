import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  delay: number;
}

export function ContactInfoCard({ icon: Icon, label, value, delay }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className='flex items-start gap-3 rounded-xl border border-black/5 dark:border-white/5 bg-card p-4 shadow-sm
                 transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5'>
      <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10'>
        <Icon className='h-4 w-4 text-primary' />
      </div>
      <div>
        <p className='text-xs font-medium text-muted-foreground'>{label}</p>
        <p className='mt-0.5 text-sm font-semibold text-foreground'>{value}</p>
      </div>
    </motion.div>
  );
}
