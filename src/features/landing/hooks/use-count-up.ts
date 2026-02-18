import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  onComplete?: () => void;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2,
  onComplete,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const requestRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const cancelAnimation = useCallback(() => {
    if (requestRef.current) {
      window.cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);

  const animateCount = useCallback(() => {
    cancelAnimation();
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min(
        (timestamp - startTimestamp) / (duration * 1000),
        1,
      );

      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = Math.floor(easeOutExpo * (end - start) + start);

      setCount(value);

      if (progress < 1) {
        requestRef.current = window.requestAnimationFrame(step);
      } else {
        setCount(end);
        onCompleteRef.current?.();
      }
    };

    requestRef.current = window.requestAnimationFrame(step);
  }, [start, end, duration, cancelAnimation]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasAnimated.current = true;
            setIsVisible(true);
            setCount(start);
            animateCount();
          } else if (hasAnimated.current) {
            hasAnimated.current = false;
            setIsVisible(false);
            setCount(start);
            cancelAnimation();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      },
    );

    const el = elementRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      cancelAnimation();
    };
  }, [animateCount, cancelAnimation, start]);

  return { count, isVisible, elementRef };
}
