import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountUp } from '../hooks/use-count-up';

const observeMock = vi.fn();
const unobserveMock = vi.fn();
let intersectionCallback: IntersectionObserverCallback;

beforeEach(() => {
  observeMock.mockClear();
  unobserveMock.mockClear();

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        intersectionCallback = cb;
      }
      observe = observeMock;
      unobserve = unobserveMock;
      disconnect = vi.fn();
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

/** Helper: creates a real div, assigns it to the ref, then renders the hook */
function renderWithRef(opts: { start?: number; end: number; duration?: number }) {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const hook = renderHook(() => useCountUp(opts));

  // Manually assign the div to elementRef so IntersectionObserver.observe is called
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (hook.result.current.elementRef as any).current = div;

  // Re-run the effect by forcing a re-render
  act(() => hook.rerender());

  return { ...hook, div };
}

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

  it('registers IntersectionObserver on mount (with real ref element)', () => {
    const { div, unmount } = renderWithRef({ start: 0, end: 100, duration: 1 });
    expect(observeMock).toHaveBeenCalledWith(div);
    unmount();
    document.body.removeChild(div);
  });

  it('unregisters IntersectionObserver on unmount (with real ref element)', () => {
    const { div, unmount } = renderWithRef({ start: 0, end: 100, duration: 1 });
    unmount();
    expect(unobserveMock).toHaveBeenCalledWith(div);
    document.body.removeChild(div);
  });
});
