// src/shared/hooks/use-count-up.ts

import { useState, useEffect, useRef } from 'react';

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
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const animateCount = () => {
      let startTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;

        const progress = Math.min(
          (timestamp - startTimestamp) / (duration * 1000),
          1,
        );

        // Easing function for smoother animation
        const easeOutExpo =
          progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const value = Math.floor(easeOutExpo * (end - start) + start);

        setCount(value);

        if (progress < 1) {
          requestRef.current = window.requestAnimationFrame(step);
        } else {
          setCount(end); // Ensure final value is exact
          onComplete?.();
        }
      };

      requestRef.current = window.requestAnimationFrame(step);
    };

    // IntersectionObserver with better threshold
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Start animation when element is 30% visible
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
            setCount(start);
            animateCount();
            hasAnimated.current = true;
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of element is visible
        rootMargin: '0px 0px -50px 0px', // Start slightly before entering viewport
      },
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      if (requestRef.current) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, [start, end, duration, onComplete]);

  return { count, isVisible, elementRef };
}
