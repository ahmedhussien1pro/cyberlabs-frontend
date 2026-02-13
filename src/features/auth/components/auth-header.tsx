// src/features/auth/components/AuthHeader.tsx
export function AuthHeader({ icon, title, subtitle }: HeaderProps) {
  return (
    <div className='text-center mb-6'>
      {icon && <div className='mb-4'>{icon}</div>}
      <h1 className='text-2xl font-bold'>{title}</h1>
      {subtitle && <p className='text-muted-foreground mt-2'>{subtitle}</p>}
    </div>
  );
}
