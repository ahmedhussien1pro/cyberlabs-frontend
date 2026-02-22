import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className='flex flex-col items-center gap-1.5 rounded-xl border border-border/40
                 bg-card p-4 text-center transition-all duration-200
                 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5'>
      <Icon className={`h-5 w-5 ${color}`} />
      <span className='text-xl font-black text-foreground'>{value}</span>
      <span className='text-[11px] leading-tight text-muted-foreground'>
        {label}
      </span>
    </motion.div>
  );
}
