"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface BigPercentageProps {
  percent: number;
  expected: number;
  animated?: boolean;
}

export function BigPercentage({ percent, expected, animated = true }: BigPercentageProps) {
  const count = useMotionValue(animated ? 0 : percent);
  const display = useTransform(count, (v) => `${Math.round(v)}%`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (animated && !hasAnimated.current) {
      hasAnimated.current = true;
      animate(count, percent, {
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1],
      });
    } else if (!animated) {
      count.set(percent);
    }
  }, [percent, animated, count]);

  return (
    <div className="text-center">
      <p className="text-5xl md:text-7xl font-serif tracking-tight">
        {Math.round(expected)}
      </p>
      <p className="mt-1 text-lg text-muted">
        years expected
      </p>
      <motion.p className="mt-4 text-3xl md:text-4xl font-serif text-muted/80">
        {display}
      </motion.p>
      <p className="mt-1 text-sm text-muted">
        life completed
      </p>
    </div>
  );
}
