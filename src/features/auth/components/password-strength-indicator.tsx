import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { usePasswordStrength } from '../hooks/usePasswordStrength';

interface PasswordStrengthIndicatorProps {
  password: string;
  minLength?: number;
  showRequirements?: boolean;
}

/**
 * Reusable password strength indicator with visual feedback
 * Shows strength bar and optional requirements checklist
 */
export function PasswordStrengthIndicator({
  password,
  minLength = 6,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const strength = usePasswordStrength(password, minLength);

  if (!password) return null;

  return (
    <div className='space-y-3'>
      {/* Strength Bar */}
      <div className='auth-page__strength'>
        <div className='auth-page__strength-bar'>
          <motion.div
            className={`auth-page__strength-fill auth-page__strength-fill--${strength.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${(strength.score / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className='auth-page__strength-text'>
          Password strength:{' '}
          <span
            className={`auth-page__strength-label auth-page__strength-label--${strength.color}`}>
            {strength.label}
          </span>
        </p>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className='auth-page__requirements'>
          <p className='auth-page__requirements-title'>
            Password must contain:
          </p>
          <ul className='auth-page__requirements-list'>
            <li
              className={
                strength.hasMinLength ? 'auth-page__requirement--valid' : ''
              }>
              <CheckCircle size={16} />
              At least {minLength} characters
            </li>
            <li
              className={
                strength.hasUpperCase ? 'auth-page__requirement--valid' : ''
              }>
              <CheckCircle size={16} />
              One uppercase letter
            </li>
            <li
              className={
                strength.hasLowerCase ? 'auth-page__requirement--valid' : ''
              }>
              <CheckCircle size={16} />
              One lowercase letter
            </li>
            <li
              className={
                strength.hasNumber ? 'auth-page__requirement--valid' : ''
              }>
              <CheckCircle size={16} />
              One number
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
