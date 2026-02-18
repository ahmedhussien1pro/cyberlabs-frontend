import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { calculatePasswordStrength } from '../utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  className = '',
}: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation('auth');
  const strength = calculatePasswordStrength(password);

  if (!password) return null;

  const widthPercentage = (strength.score / 5) * 100;

  const strengthLabelMap: Record<string, string> = {
    'Very Weak': t('passwordStrength.veryWeak'),
    Weak: t('passwordStrength.weak'),
    Fair: t('passwordStrength.fair'),
    Good: t('passwordStrength.good'),
    Strong: t('passwordStrength.strong'),
  };

  const suggestionMap: Record<string, string> = {
    'Use at least 8 characters': t('passwordStrength.suggestions.minLength'),
    'Add uppercase letters': t('passwordStrength.suggestions.uppercase'),
    'Add lowercase letters': t('passwordStrength.suggestions.lowercase'),
    'Include numbers': t('passwordStrength.suggestions.number'),
    'Add special characters': t('passwordStrength.suggestions.special'),
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className='h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
        <motion.div
          className={`h-full ${strength.color} transition-all duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${widthPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className='flex items-center justify-between text-xs'>
        <span className='text-muted-foreground'>
          {t('passwordStrength.label')}:
        </span>
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
          {strengthLabelMap[strength.label] || strength.label}
        </span>
      </div>

      {strength.suggestions.length > 0 && strength.score < 3 && (
        <motion.ul
          className='text-xs text-muted-foreground space-y-1 pl-4 list-disc'
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}>
          {strength.suggestions.slice(0, 2).map((suggestion, index) => (
            <li key={index}>{suggestionMap[suggestion] || suggestion}</li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
