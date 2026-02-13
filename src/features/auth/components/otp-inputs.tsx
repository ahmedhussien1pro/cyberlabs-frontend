import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface OtpInputsProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export function OtpInputs({ value, onChange, length = 6 }: OtpInputsProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  const handleChange = (index: number, val: string) => {
    const newValue =
      value.substring(0, index) + val + value.substring(index + 1);
    onChange(newValue);
    if (val && index < length - 1) {
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      setFocusedIndex(index - 1);
    }
  };

  return (
    <div className='auth-page__otp-inputs grid grid-cols-6 gap-3 w-full'>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            className='auth-page__otp-input'
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            autoComplete='one-time-code'
          />
        ))}
    </div>
  );
}
