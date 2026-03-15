/**
 * Shared framer-motion mock — strips animation props before passing to DOM.
 * Import this in vi.mock() calls to avoid "unknown prop" React warnings.
 */
import React from 'react';

const MOTION_PROPS = new Set([
  'initial', 'animate', 'exit', 'transition', 'variants',
  'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView',
  'viewport', 'layout', 'layoutId', 'drag', 'dragConstraints',
  'onAnimationStart', 'onAnimationComplete', 'onUpdate',
]);

function stripMotionProps(props: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(props).filter(([k]) => !MOTION_PROPS.has(k)),
  );
}

export const motion = new Proxy({} as Record<string, unknown>, {
  get: (_target, tag: string) => {
    const Component = ({ children, ...props }: React.HTMLAttributes<HTMLElement> & Record<string, unknown>) => {
      const Tag = tag as keyof JSX.IntrinsicElements;
      const clean = stripMotionProps(props as Record<string, unknown>);
      return React.createElement(Tag, clean as object, children);
    };
    Component.displayName = `motion.${tag}`;
    return Component;
  },
});

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export { useAnimation, useMotionValue, useTransform, useSpring } from 'framer-motion';
