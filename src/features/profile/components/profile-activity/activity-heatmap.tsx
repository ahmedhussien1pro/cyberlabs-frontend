import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { UserActivity } from '../../types/profile.types';

const WEEKS = 52;
const DAYS = 7;

function getColorClass(count: number): string {
  if (count === 0) return 'bg-muted';
  if (count === 1) return 'bg-primary/20';
  if (count === 2) return 'bg-primary/40';
  if (count <= 4) return 'bg-primary/65';
  return 'bg-primary';
}

function buildGrid(activities: UserActivity[]) {
  const map = new Map(activities.map((a) => [a.date.slice(0, 10), a]));
  const today = new Date();
  const result: Array<{ date: string; count: number }> = [];

  for (let i = WEEKS * DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const act = map.get(key);
    const count = act ? act.labsSolved + act.completedTasks : 0;
    result.push({ date: key, count });
  }
  return result;
}

// Mock data used until backend adds GET /users/me/activity
function generateMockActivity(): UserActivity[] {
  const activities: UserActivity[] = [];
  const today = new Date();
  for (let i = WEEKS * DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (Math.random() > 0.6) {
      activities.push({
        date: d.toISOString(),
        activeMinutes: Math.floor(Math.random() * 90),
        completedTasks: Math.floor(Math.random() * 3),
        labsSolved: Math.floor(Math.random() * 3),
      });
    }
  }
  return activities;
}

interface Props {
  activities?: UserActivity[];
}

export function ActivityHeatmap({ activities }: Props) {
  const { t } = useTranslation('profile');
  const data = useMemo(
    () => buildGrid(activities ?? generateMockActivity()),
    [activities],
  );

  const weeks: (typeof data)[] = [];
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(data.slice(w * DAYS, (w + 1) * DAYS));
  }

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section className='space-y-3'>
      <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
        <span className='h-1.5 w-1.5 rounded-full bg-primary' />
        {t('activity.title')}
      </h2>
      <div className='overflow-x-auto rounded-xl border border-border/40 bg-card p-4'>
        <div className='flex gap-1' dir='ltr'>
          {/* Day labels */}
          <div className='flex flex-col gap-1 pt-5'>
            {DAY_LABELS.map((d, i) => (
              <div
                key={d}
                className='h-3 w-6 text-right text-[9px] leading-3 text-muted-foreground'>
                {i % 2 === 1 ? d : ''}
              </div>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className='flex flex-col gap-1'>
              {wi === 0 && <div className='h-4' />}
              {week.map((cell) => (
                <motion.div
                  key={cell.date}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: wi * 0.005 }}
                  title={`${cell.date}: ${cell.count} activities`}
                  className={`h-3 w-3 cursor-pointer rounded-[2px] transition-transform hover:scale-125
                              ${getColorClass(cell.count)}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className='mt-3 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground'>
          <span>{t('activity.less')}</span>
          {[0, 1, 2, 3, 5].map((v) => (
            <div
              key={v}
              className={`h-3 w-3 rounded-[2px] ${getColorClass(v)}`}
            />
          ))}
          <span>{t('activity.more')}</span>
        </div>
      </div>
    </section>
  );
}
