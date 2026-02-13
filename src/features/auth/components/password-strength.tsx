import { motion } from 'framer-motion';

interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  requirements?: PasswordStrength;
}

export function PasswordStrengthIndicator({
  password,
  requirements,
}: PasswordStrengthIndicatorProps) {
  const defaultRequirements: PasswordStrength = requirements || {
    hasMinLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const strengthScore =
    Object.values(defaultRequirements).filter(Boolean).length;

  const strengthConfig = {
    0: { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' },
    1: { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' },
    2: { label: 'Fair', color: 'bg-orange-500', textColor: 'text-orange-500' },
    3: { label: 'Good', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    4: { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' },
  };

  const config = strengthConfig[strengthScore as keyof typeof strengthConfig];

  if (!password) return null;

  return (
    <div className='space-y-2 -mt-2'>
      <div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
        <motion.div
          className={`h-full ${config.color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${(strengthScore / 4) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className='text-sm text-muted-foreground'>
        Password strength:{' '}
        <span className={`font-semibold ${config.textColor}`}>
          {config.label}
        </span>
      </p>
    </div>
  );
}
