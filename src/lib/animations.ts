/**
 * Animation utilities and constants for consistent, delightful motion
 * across the How Are You app.
 *
 * These utilities follow Framer Motion best practices and respect
 * user preferences for reduced motion.
 */

import { useEffect, useState } from "react";
import { Variant } from "framer-motion";

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Animation variants for staggered card entrance
 */
export const cardVariants = {
  hidden: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : 20
  },
  visible: {
    opacity: 1,
    y: 0
  },
};

/**
 * Container variants for stagger children effect
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Fade up animation variant
 */
export const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    },
  },
};

/**
 * Scale fade animation variant
 */
export const scaleFadeVariants = {
  hidden: {
    opacity: 0,
    scale: prefersReducedMotion() ? 1 : 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Spring animation configuration (natural feel)
 */
export const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

/**
 * Smooth spring animation configuration
 */
export const smoothSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
};

/**
 * Bounce spring animation configuration
 */
export const bounceSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 20,
};

/**
 * Hover lift effect
 */
export const hoverLift = prefersReducedMotion()
  ? {}
  : {
      y: -4,
      transition: { duration: 0.2 },
    };

/**
 * Tap scale effect
 */
export const tapScale = prefersReducedMotion()
  ? {}
  : {
      scale: 0.98,
    };

/**
 * Custom hook for counting up numbers with easing
 */
export function useCountUp(
  end: number,
  duration: number = 1000,
  enabled: boolean = true
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuad easing
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);

      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, enabled]);

  return count;
}

/**
 * Custom hook for counting up decimal numbers
 */
export function useCountUpDecimal(
  end: number,
  duration: number = 1000,
  decimals: number = 1,
  enabled: boolean = true
): string {
  const [count, setCount] = useState("0");

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      setCount(end.toFixed(decimals));
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuad easing
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;

      setCount(current.toFixed(decimals));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end.toFixed(decimals));
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, decimals, enabled]);

  return count;
}

/**
 * Stagger delay for child items
 */
export const getStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return prefersReducedMotion() ? 0 : index * baseDelay;
};

/**
 * Success animation variants
 */
export const successVariants = {
  hidden: {
    opacity: 0,
    scale: prefersReducedMotion() ? 1 : 0.8,
    y: prefersReducedMotion() ? 0 : 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: prefersReducedMotion() ? 1 : 0.95,
    transition: { duration: 0.2 },
  },
};

/**
 * Shimmer loading animation keyframes
 */
export const shimmerVariants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

/**
 * Pulse animation for attention
 */
export const pulseVariants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Celebration animation for milestones
 */
export const celebrationVariants = {
  initial: { scale: 1, rotate: 0 },
  celebrate: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

/**
 * Page transition variants
 */
export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : -20,
    transition: {
      duration: 0.3,
    },
  },
};
