"use client";

import { useRef, useState, useEffect } from "react";
import { CalculatorResult } from "@/lib/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { StickyResultsBanner } from "@/components/ui/StickyResultsBanner";
import { BigPercentage } from "./BigPercentage";
import { YearsLeftSubtitle } from "./YearsLeftSubtitle";
import { MonthsGrid } from "./MonthsGrid";
import { StagesBar } from "./StagesBar";
import { BiggestLever } from "./BiggestLever";
import { ViralStats } from "./ViralStats";
import { ShareButton } from "@/components/share/ShareButton";

interface RevealSequenceProps {
  result: CalculatorResult;
  age: number;
  onPlay: () => void;
  shareUrl: string;
}

export function RevealSequence({ result, age, onPlay, shareUrl }: RevealSequenceProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBanner(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-20 space-y-16">
      <StickyResultsBanner
        expected={result.expected}
        percentLived={result.percentLived}
        visible={showBanner}
      />

      <div ref={statsRef}>
        <FadeIn delay={0}>
          <BigPercentage
            percent={result.percentLived}
            expected={result.expected}
          />
        </FadeIn>

        <FadeIn delay={0.4}>
          <YearsLeftSubtitle yearsLeft={result.yearsLeft} age={age} />
        </FadeIn>
      </div>

      <FadeIn delay={0.8}>
        <MonthsGrid
          ageMonths={Math.floor(age * 12)}
          totalMonths={Math.round(result.expected * 12)}
        />
      </FadeIn>

      <FadeIn delay={1.2}>
        <StagesBar age={age} />
      </FadeIn>

      <FadeIn delay={1.6}>
        <BiggestLever lever={result.biggestLever} />
      </FadeIn>

      <FadeIn delay={2.0}>
        <ViralStats
          weekendsLeft={result.weekendsLeft}
          booksLeft={result.booksLeft}
          mealsLeft={result.mealsLeft}
        />
      </FadeIn>

      <FadeIn delay={2.4}>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <ShareButton
            url={shareUrl}
            percentLived={result.percentLived}
            className="px-8 py-3 bg-foreground text-background border border-foreground rounded-lg text-base hover:opacity-90 transition-opacity"
          />
          <button
            onClick={onPlay}
            className="px-8 py-3 border border-foreground rounded-lg text-base hover:bg-foreground hover:text-background transition-colors"
          >
            Play with the numbers
          </button>
        </div>
      </FadeIn>
    </div>
  );
}
