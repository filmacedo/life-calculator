"use client";

import { useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { Container } from "@/components/ui/Container";
import { QuestionFlow } from "@/components/calculator/QuestionFlow";
import { RevealSequence } from "@/components/reveal/RevealSequence";
import { PlayMode } from "@/components/play/PlayMode";
import { FadeIn } from "@/components/ui/FadeIn";

interface CalculatorProps {
  initialParam?: string | null;
}

export function Calculator({ initialParam }: CalculatorProps) {
  const [started, setStarted] = useState(!!initialParam);
  const {
    phase,
    answers,
    result,
    shareUrl,
    completeInput,
    goToPlay,
    updateAnswer,
  } = useCalculator(initialParam);

  // Landing page
  if (!started) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6">
        <Container>
          <FadeIn>
            <div className="max-w-lg mx-auto text-center space-y-8 py-20">
              <h1 className="text-4xl md:text-5xl font-serif leading-tight">
                How Much Life Left?
              </h1>
              <p className="text-lg text-muted leading-relaxed">
                A playful estimate of how much life is still ahead of you.
              </p>
              <button
                onClick={() => setStarted(true)}
                className="px-8 py-4 bg-foreground text-background rounded-lg text-lg font-medium hover:opacity-90 transition-opacity"
              >
                Start
              </button>
              <div className="text-xs text-muted flex justify-center gap-4">
                <a
                  href="/life-calculator/filipe"
                  className="underline hover:text-foreground"
                >
                  See how Filipe scored
                </a>
                <a
                  href="/life-calculator/methodology"
                  className="underline hover:text-foreground"
                >
                  Methodology
                </a>
              </div>
            </div>
          </FadeIn>
        </Container>
      </div>
    );
  }

  if (phase === "input") {
    return <QuestionFlow onComplete={completeInput} />;
  }

  if (phase === "reveal" && result && answers) {
    return (
      <Container>
        <RevealSequence result={result} age={answers.age} onPlay={goToPlay} />
      </Container>
    );
  }

  if (phase === "play" && result && answers) {
    return (
      <Container>
        <PlayMode
          answers={answers}
          result={result}
          onAnswerChange={updateAnswer}
          shareUrl={shareUrl}
        />
      </Container>
    );
  }

  return null;
}
