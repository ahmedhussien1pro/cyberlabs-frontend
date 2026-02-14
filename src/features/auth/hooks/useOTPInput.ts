import { useState, useRef, useCallback } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
export const useOTPInput = (length: number = 6) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));

  const refs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

  const handleChange = useCallback(
    (index: number, value: string) => {
      const numericValue = value.replace(/[^0-9]/g, '');

      const singleChar = numericValue.slice(-1);

      const newValues = [...values];
      newValues[index] = singleChar;
      setValues(newValues);

      if (singleChar && index < length - 1) {
        refs.current[index + 1]?.focus();
      }
    },
    [values, length],
  );

  const handleKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace') {
        if (!values[index] && index > 0) {
          refs.current[index - 1]?.focus();

          const newValues = [...values];
          newValues[index - 1] = '';
          setValues(newValues);
        } else {
          const newValues = [...values];
          newValues[index] = '';
          setValues(newValues);
        }
      }

      if (event.key === 'ArrowLeft' && index > 0) {
        refs.current[index - 1]?.focus();
      }
      if (event.key === 'ArrowRight' && index < length - 1) {
        refs.current[index + 1]?.focus();
      }
    },
    [values, length],
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();

      const pastedText = event.clipboardData.getData('text');

      const numericText = pastedText.replace(/[^0-9]/g, '');

      const pastedValues = numericText.split('').slice(0, length);

      const newValues = [...values];
      pastedValues.forEach((value, index) => {
        newValues[index] = value;
      });
      setValues(newValues);

      const nextEmptyIndex = newValues.findIndex((val) => !val);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
      refs.current[focusIndex]?.focus();
    },
    [values, length],
  );

  const clear = useCallback(() => {
    setValues(Array(length).fill(''));
    refs.current[0]?.focus();
  }, [length]);

  const focus = useCallback(() => {
    refs.current[0]?.focus();
  }, []);

  const isComplete = values.every((val) => val !== '');

  const otp = values.join('');

  return {
    values,
    refs,
    handleChange,
    handleKeyDown,
    handlePaste,
    clear,
    focus,
    isComplete,
    otp,
  };
};
