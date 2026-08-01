// Mock framer-motion to avoid ESM/animation issues in Jest
const motion: any = new Proxy(
  {},
  {
    get: (_target, prop) => {
      const Tag = String(prop);
      // Return a simple functional component that renders the underlying HTML tag
      const MockComponent = ({
        children,
        ...rest
      }: React.PropsWithChildren<any>) => {
        const React = require("react");
        // Remove framer-motion-specific props before passing to DOM element
        const { initial, animate, transition, whileHover, whileTap, variants, exit, ...domProps } = rest;
        return React.createElement(Tag, domProps, children);
      };
      MockComponent.displayName = `motion.${Tag}`;
      return MockComponent;
    },
  }
);

export { motion };
export const AnimatePresence = ({ children }: React.PropsWithChildren<{}>) => children;
export const useAnimation = () => ({ start: jest.fn(), stop: jest.fn() });
export const useMotionValue = (initial: any) => ({ get: () => initial, set: jest.fn() });
export const useTransform = () => ({ get: jest.fn() });
export const useInView = () => [null, false];
