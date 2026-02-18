// src/features/dashboard/components/cards/stats-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/shared/utils';
import type { StatsCardProps } from '../../types';

export function StatsCard({
  title,
  value,
  icon,
  trend,
  description,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        <div className='text-muted-foreground'>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs',
              trend.isPositive ? 'text-green-500' : 'text-red-500',
            )}>
            {trend.isPositive ? (
              <TrendingUp className='h-3 w-3' />
            ) : (
              <TrendingDown className='h-3 w-3' />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
        {description && (
          <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
