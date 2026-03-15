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

export const motion = new Proxy(
  {} as Record<string, ReturnType<typeof makeMotionComponent>>,
  { get: (_target, tag: string) => makeMotionComponent(tag) },
);

/**
 * AnimatePresence mock — renders children directly with no exit-animation delay.
 * Note: {hovered && <X/>} produces `false` when hovered=false.
 * We must NOT render `false` as a node, so we coerce with Boolean check.
 */
export function AnimatePresence({
  children,
}: {
  children?: React.ReactNode;
  mode?: string;
  initial?: boolean;
}) {
  // Filter out falsy non-null values (false, 0, '') that React would skip anyway
  const nodes = React.Children.toArray(children);
  return React.createElement(React.Fragment, null, ...nodes);
}

export const useAnimation = () => ({ start: () => {}, stop: () => {} });
export const useMotionValue = (initial: number) => ({ get: () => initial, set: () => {} });
export const useTransform = () => ({ get: () => 0 });
export const useSpring = (val: unknown) => val;
