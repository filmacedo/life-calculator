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
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="text-5xl md:text-6xl font-serif">{Math.round(expected)}</p>
        <p className="text-sm text-muted mt-1">years expected</p>
      </div>
      <div>
        <motion.p className="text-5xl md:text-6xl font-serif">{display}</motion.p>
        <p className="text-sm text-muted mt-1">life completed</p>
      </div>
    </div>
  );
}
