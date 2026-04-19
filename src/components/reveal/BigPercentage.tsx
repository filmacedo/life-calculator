"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface BigPercentageProps {
  percent: number;
  expected: number;
  animated?: boolean;
}

export function BigPercentage({ percent, expected, animated = true }: BigPercentageProps) {
  const percentCount = useMotionValue(animated ? 0 : percent);
  const expectedCount = useMotionValue(animated ? 0 : expected);
  const percentDisplay = useTransform(percentCount, (v) => `${Math.round(v)}%`);
  const expectedDisplay = useTransform(expectedCount, (v) => `${Math.round(v)}`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (animated && !hasAnimated.current) {
      hasAnimated.current = true;
      const ease = [0.22, 1, 0.36, 1] as const;
      animate(expectedCount, expected, { duration: 1.6, ease });
      animate(percentCount, percent, { duration: 1.8, ease });
    } else if (!animated) {
      percentCount.set(percent);
      expectedCount.set(expected);
    }
  }, [percent, expected, animated, percentCount, expectedCount]);

  return (
    <div className="flex items-center justify-center gap-10 md:gap-20">
      <div className="text-center">
        <motion.p className="text-7xl md:text-9xl font-serif leading-[0.9] tabular-nums">
          {expectedDisplay}
        </motion.p>
        <p className="text-xs md:text-sm text-muted mt-4 tracking-wide">expected lifespan</p>
      </div>
      <div className="h-16 md:h-24 w-px bg-border self-center" aria-hidden />
      <div className="text-center">
        <motion.p className="text-7xl md:text-9xl font-serif leading-[0.9] tabular-nums">
          {percentDisplay}
        </motion.p>
        <p className="text-xs md:text-sm text-muted mt-4 tracking-wide">life completed</p>
      </div>
    </div>
  );
}
