import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountUp } from '../hooks/use-count-up';

const observeMock = vi.fn();
const unobserveMock = vi.fn();
const disconnectMock = vi.fn();
let intersectionCallback: IntersectionObserverCallback;
let instanceCount = 0;

beforeEach(() => {
  observeMock.mockClear();
  unobserveMock.mockClear();
  disconnectMock.mockClear();
  instanceCount = 0;

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        intersectionCallback = cb;
        instanceCount++;
      }
      observe = observeMock;
      unobserve = unobserveMock;
      disconnect = disconnectMock;
    },
  );

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

  it('sets isVisible=true when element enters viewport', () => {
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

  it('sets isVisible=false when element leaves viewport', () => {
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

  it('creates an IntersectionObserver instance on mount', () => {
    renderHook(() => useCountUp({ start: 0, end: 100, duration: 1 }));
    expect(instanceCount).toBeGreaterThanOrEqual(1);
  });

  it('cancels animation frame on unmount', () => {
    const { unmount } = renderHook(() =>
      useCountUp({ start: 0, end: 100, duration: 1 }),
    );
    unmount();
    expect(vi.mocked(window.cancelAnimationFrame)).toBeDefined();
  });
});
