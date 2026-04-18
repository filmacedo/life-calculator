"use client";

import { CalculatorResult } from "@/lib/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { BigPercentage } from "./BigPercentage";
import { YearsLeftSubtitle } from "./YearsLeftSubtitle";
import { MonthsGrid } from "./MonthsGrid";
import { StagesBar } from "./StagesBar";
import { BiggestLever } from "./BiggestLever";
import { ViralStats } from "./ViralStats";

interface RevealSequenceProps {
  result: CalculatorResult;
  age: number;
  onPlay: () => void;
}

export function RevealSequence({ result, age, onPlay }: RevealSequenceProps) {
  return (
    <div className="py-20 space-y-16">
      <FadeIn delay={0}>
        <BigPercentage
          percent={result.percentLived}
          expected={result.expected}
        />
      </FadeIn>

      <FadeIn delay={0.4}>
        <YearsLeftSubtitle yearsLeft={result.yearsLeft} age={age} />
      </FadeIn>

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
        <div className="text-center">
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
