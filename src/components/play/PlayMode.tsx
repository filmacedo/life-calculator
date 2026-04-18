"use client";

import { UserAnswers, CalculatorResult, SmokingStatus } from "@/lib/types";
import { MonthsGrid } from "@/components/reveal/MonthsGrid";
import { StagesBar } from "@/components/reveal/StagesBar";
import { BiggestLever } from "@/components/reveal/BiggestLever";
import { ViralStats } from "@/components/reveal/ViralStats";
import { ShareBar } from "@/components/share/ShareBar";
import { ModifierSlider } from "./ModifierSlider";

interface PlayModeProps {
  answers: UserAnswers;
  result: CalculatorResult;
  onAnswerChange: (key: string, value: number) => void;
  shareUrl: string;
}

interface SliderConfig {
  key: string;
  modifierKey: string;
  answerKey: keyof UserAnswers;
  min: number;
  max: number;
  step: number;
}

const sliderConfigs: SliderConfig[] = [
  { key: "smoking", modifierKey: "smoking", answerKey: "smoking", min: 0, max: 3, step: 1 },
  { key: "upf", modifierKey: "upf", answerKey: "upf", min: 0, max: 100, step: 1 },
  { key: "body", modifierKey: "body", answerKey: "body", min: 0, max: 100, step: 1 },
  { key: "workMovement", modifierKey: "workMovement", answerKey: "workMovement", min: 0, max: 100, step: 1 },
  { key: "workStress", modifierKey: "workStress", answerKey: "workStress", min: 0, max: 100, step: 1 },
  { key: "closeTies", modifierKey: "closeTies", answerKey: "closeTies", min: 0, max: 5, step: 1 },
  { key: "monday", modifierKey: "monday", answerKey: "monday", min: 0, max: 100, step: 1 },
  { key: "optimism", modifierKey: "optimism", answerKey: "optimism", min: 0, max: 100, step: 1 },
];

const whoopConfig: SliderConfig = {
  key: "whoopAge", modifierKey: "whoopAge", answerKey: "whoopAge", min: 18, max: 100, step: 0.1,
};

const exerciseConfig: SliderConfig = {
  key: "exercise", modifierKey: "exercise", answerKey: "exerciseDays", min: 0, max: 7, step: 1,
};

const sleepConfig: SliderConfig = {
  key: "sleep", modifierKey: "sleep", answerKey: "sleepHours", min: 4, max: 10, step: 0.5,
};

export function PlayMode({
  answers,
  result,
  onAnswerChange,
  shareUrl,
}: PlayModeProps) {
  const bioConfigs = answers.whoopEnabled
    ? [whoopConfig]
    : [exerciseConfig, sleepConfig];

  const allConfigs = [...bioConfigs, ...sliderConfigs];
  const topLeverKey = result.biggestLever
    ? result.modifiers.find(
        (m) =>
          m.label === result.biggestLever?.label ||
          result.biggestLever?.label.toLowerCase().includes(m.key)
      )?.key
    : null;

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-3 -mx-6 px-6">
        <div className="flex items-baseline justify-between max-w-2xl mx-auto">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-serif">{Math.round(result.expected)}</span>
            <span className="text-sm text-muted">years expected</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-serif text-muted/80">{result.percentLived}%</span>
            <span className="text-xs text-muted">lived</span>
          </div>
        </div>
      </div>

      <div className="py-12 space-y-12">
        <MonthsGrid
          ageMonths={Math.floor(answers.age * 12)}
          totalMonths={Math.round(result.expected * 12)}
        />

        <StagesBar age={answers.age} />

        <ShareBar url={shareUrl} percentLived={result.percentLived} />

        <div className="space-y-3">
          <h3 className="text-lg font-serif mb-4">Move the sliders, watch the numbers</h3>
          {allConfigs.map((config) => {
            const modifier = result.modifiers.find(
              (m) => m.key === config.modifierKey
            );
            if (!modifier) return null;

            const value = answers[config.answerKey] as number;
            if (value === null || value === undefined) return null;

            return (
              <ModifierSlider
                key={config.key}
                modifier={modifier}
                value={value}
                onChange={(v) => onAnswerChange(config.answerKey, v)}
                min={config.min}
                max={config.max}
                step={config.step}
                isTopLever={modifier.key === topLeverKey}
              />
            );
          })}
        </div>

        <BiggestLever lever={result.biggestLever} />
        <ViralStats
          weekendsLeft={result.weekendsLeft}
          booksLeft={result.booksLeft}
          mealsLeft={result.mealsLeft}
        />

        <ShareBar url={shareUrl} percentLived={result.percentLived} />

        <footer className="text-center text-xs text-muted pt-8 pb-12 space-y-2">
          <p>This is a toy, not medical advice.</p>
          <div className="flex justify-center gap-4">
            <a href="/life-calculator/methodology" className="underline hover:text-foreground">
              Methodology
            </a>
            <a href="/life-calculator/filipe" className="underline hover:text-foreground">
              See how Filipe scored
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
