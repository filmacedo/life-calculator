"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { UserAnswers, Phase, CalculatorResult, SmokingStatus } from "@/lib/types";
import { calculate } from "@/lib/calculator";
import { encodeAnswers, decodeAnswers } from "@/lib/permalink";

export function useCalculator(initialParam?: string | null) {
  const [answers, setAnswers] = useState<UserAnswers | null>(() => {
    if (initialParam) {
      return decodeAnswers(initialParam);
    }
    return null;
  });

  const [phase, setPhase] = useState<Phase>(() => {
    if (initialParam && decodeAnswers(initialParam)) return "reveal";
    return "input";
  });

  const result: CalculatorResult | null = useMemo(() => {
    if (!answers) return null;
    return calculate(answers);
  }, [answers]);

  const permalink = useMemo(() => {
    if (!answers) return "";
    return encodeAnswers(answers);
  }, [answers]);

  // Update URL when permalink changes (reveal or play phase)
  useEffect(() => {
    if ((phase === "reveal" || phase === "play") && permalink) {
      const url = new URL(window.location.href);
      url.searchParams.set("s", permalink);
      window.history.replaceState(null, "", url.toString());
    }
  }, [permalink, phase]);

  const completeInput = useCallback((a: UserAnswers) => {
    setAnswers(a);
    setPhase("reveal");
  }, []);

  const goToPlay = useCallback(() => {
    setPhase("play");
  }, []);

  const updateAnswer = useCallback(
    (key: string, value: number) => {
      if (!answers) return;
      setAnswers((prev) => {
        if (!prev) return prev;
        if (key === "smoking") {
          return { ...prev, smoking: value as SmokingStatus };
        }
        return { ...prev, [key]: value };
      });
    },
    [answers]
  );

  const reset = useCallback(() => {
    setAnswers(null);
    setPhase("input");
    const url = new URL(window.location.href);
    url.searchParams.delete("s");
    window.history.replaceState(null, "", url.toString());
  }, []);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("s", permalink);
    return url.toString();
  }, [permalink]);

  return {
    phase,
    answers,
    result,
    shareUrl,
    completeInput,
    goToPlay,
    updateAnswer,
    reset,
  };
}
