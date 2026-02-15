// src/features/auth/components/password-strength-indicator.tsx
import { motion } from 'framer-motion';
import { calculatePasswordStrength, type PasswordStrength } from '../utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  className = '',
}: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password);

  if (!password) return null;

  const widthPercentage = (strength.score / 5) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress Bar */}
      <div className='h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
        <motion.div
          className={`h-full ${strength.color} transition-all duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${widthPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Label */}
      <div className='flex items-center justify-between text-xs'>
        <span className='text-muted-foreground'>Password strength:</span>
        <span
          className={`font-medium ${
            strength.score <= 1
              ? 'text-red-600 dark:text-red-400'
              : strength.score === 2
                ? 'text-yellow-600 dark:text-yellow-400'
                : strength.score === 3
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-green-600 dark:text-green-400'
          }`}>
          {strength.label}
        </span>
      </div>

      {/* Suggestions */}
      {strength.suggestions.length > 0 && strength.score < 3 && (
        <motion.ul
          className='text-xs text-muted-foreground space-y-1 pl-4 list-disc'
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}>
          {strength.suggestions.slice(0, 2).map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
