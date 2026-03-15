import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountUp } from '../hooks/use-count-up';

// Mock IntersectionObserver and requestAnimationFrame for happy-dom
const observeMock = vi.fn();
const unobserveMock = vi.fn();
let intersectionCallback: IntersectionObserverCallback;

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    constructor(cb: IntersectionObserverCallback) {
      intersectionCallback = cb;
    }
    observe = observeMock;
    unobserve = unobserveMock;
    disconnect = vi.fn();
  });

  let frame = 0;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    frame++;
    setTimeout(() => cb(frame * 100), 0);
    return frame;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useCountUp', () => {
  it('initialises count to start value', () => {
    const { result } = renderHook(() =>
      useCountUp({ start: 0, end: 100, duration: 1 }),
    );
    expect(result.current.count).toBe(0);
  });

  it('exposes elementRef', () => {
    const { result } = renderHook(() =>
      useCountUp({ start: 0, end: 50, duration: 1 }),
    );
    expect(result.current.elementRef).toBeDefined();
  });

  it('isVisible starts as false', () => {
    const { result } = renderHook(() =>
      useCountUp({ start: 0, end: 50, duration: 1 }),
    );
    expect(result.current.isVisible).toBe(false);
  });

  it('sets isVisible=true when element enters viewport', async () => {
    const { result } = renderHook(() =>
      useCountUp({ start: 0, end: 50, duration: 0.1 }),
    );
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(result.current.isVisible).toBe(true);
  });

  it('sets isVisible=false when element leaves viewport', async () => {
    const { result } = renderHook(() =>
      useCountUp({ start: 0, end: 50, duration: 0.1 }),
    );
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    act(() => {
      intersectionCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(result.current.isVisible).toBe(false);
  });

  it('registers IntersectionObserver on mount', () => {
    renderHook(() => useCountUp({ start: 0, end: 100, duration: 1 }));
    expect(observeMock).toHaveBeenCalled();
  });

  it('unregisters IntersectionObserver on unmount', () => {
    const { unmount } = renderHook(() =>
      useCountUp({ start: 0, end: 100, duration: 1 }),
    );
    unmount();
    expect(unobserveMock).toHaveBeenCalled();
  });
});
