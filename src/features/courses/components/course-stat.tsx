// src/features/courses/components/course-stat.tsx
// Single stat pill used in CourseDetailHero bottom bar
export function CourseStat({
  icon,
  value,
  label,
  textClass,
}: {
  icon: React.ReactNode;
  value?: number | string;
  label?: string;
  textClass: string;
}) {
  return (
    <div className='flex items-center gap-1.5 text-xs'>
      <span className={textClass}>{icon}</span>
      <span className='font-bold text-white'>{value}</span>
      {label && <span className='text-white/45'>{label}</span>}
    </div>
  );
}
