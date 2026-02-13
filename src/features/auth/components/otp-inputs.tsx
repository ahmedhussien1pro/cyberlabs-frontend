// src/features/auth/components/otp-inputs.tsx
import { useEffect, useRef, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';

interface OTPInputsProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  autoSubmit?: boolean;
  onComplete?: (otp: string) => void;
}

/**
 * Enhanced OTP Input Component
 * Features:
 * - Paste support
 * - Arrow key navigation
 * - Auto-focus management
 * - Auto-submit on completion
 * - Backspace navigation
 */
export function OTPInputs({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoSubmit = false,
  onComplete,
}: OTPInputsProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-submit when complete
  useEffect(() => {
    const otpCode = value.join('');
    if (autoSubmit && otpCode.length === length && onComplete) {
      onComplete(otpCode);
    }
  }, [value, autoSubmit, length, onComplete]);

  const handleChange = (index: number, val: string) => {
    // Only allow numbers
    if (val && !/^\d$/.test(val)) return;

    const newValue = [...value];
    newValue[index] = val;
    onChange(newValue);

    // Move to next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newValue = [...value];
        newValue[index] = '';
        onChange(newValue);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Only process if it's all digits
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, length).split('');
      const newValue = [...value];

      digits.forEach((digit, index) => {
        if (index < length) {
          newValue[index] = digit;
        }
      });

      onChange(newValue);

      // Focus last filled input
      const lastFilledIndex = Math.min(digits.length, length) - 1;
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  return (
    <div className='flex justify-center gap-2 w-full' onPaste={handlePaste}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={disabled}
            autoComplete='off'
            className='w-12 h-12 text-center text-lg font-semibold'
          />
        ))}
    </div>
  );
}
