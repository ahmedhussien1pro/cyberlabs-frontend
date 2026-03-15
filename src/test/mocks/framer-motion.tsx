import React from 'react';

const MOTION_PROPS = new Set([
  'initial', 'animate', 'exit', 'transition', 'variants',
  'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView',
  'viewport', 'layout', 'layoutId', 'drag', 'dragConstraints',
  'onAnimationStart', 'onAnimationComplete', 'onUpdate',
]);

function stripMotionProps(props: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(props).filter(([k]) => !MOTION_PROPS.has(k)),
  );
}

type AnyProps = Record<string, unknown> & { children?: React.ReactNode };

function makeMotionComponent(tag: string) {
  const Component = ({ children, ...props }: AnyProps) => {
    const clean = stripMotionProps(props);
    return React.createElement(tag, clean, children);
  };
  Component.displayName = `motion.${tag}`;
  return Component;
}

export const motion = new Proxy({} as Record<string, ReturnType<typeof makeMotionComponent>>, {
  get: (_target, tag: string) => makeMotionComponent(tag),
});

export const AnimatePresence = ({ children }: { children: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);

export const useAnimation = () => ({ start: () => {}, stop: () => {} });
export const useMotionValue = (initial: number) => ({ get: () => initial, set: () => {} });
export const useTransform = () => ({ get: () => 0 });
export const useSpring = (val: unknown) => val;
