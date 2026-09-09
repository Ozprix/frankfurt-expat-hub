import React from 'react';

const motionProps = new Set([
  'animate',
  'exit',
  'initial',
  'layout',
  'transition',
  'variants',
  'viewport',
  'whileHover',
  'whileInView',
  'whileTap',
]);

const createMotionComponent = (tag) =>
  React.forwardRef(({ children, ...props }, ref) => {
    const domProps = {};

    for (const [key, value] of Object.entries(props)) {
      if (!motionProps.has(key)) {
        domProps[key] = value;
      }
    }

    return React.createElement(tag, { ...domProps, ref }, children);
  });

// Cache one component per tag so motion.div returns a STABLE identity across
// renders. Without this, every render created a new component type, remounting
// the whole subtree and dropping focus from inputs on each keystroke.
const componentCache = {};

export const motion = new Proxy({}, {
  get: (_target, tag) => (componentCache[tag] ??= createMotionComponent(tag)),
});

export const AnimatePresence = ({ children }) => React.createElement(React.Fragment, null, children);
