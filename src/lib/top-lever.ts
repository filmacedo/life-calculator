import { UserAnswers, LeverCandidate } from "./types";
import { calculate } from "./calculator";

interface LeverTest {
  condition: (a: UserAnswers) => boolean;
  patch: Partial<UserAnswers>;
  label: string;
}

const leverTests: LeverTest[] = [
  {
    condition: (a) => a.smoking >= 2,
    patch: { smoking: 0 },
    label: "Quit smoking (and stay quit for a decade)",
  },
  {
    condition: (a) => a.upf > 30,
    patch: { upf: 10 },
    label: "Cut ultra-processed food to almost none",
  },
  {
    condition: (a) => a.body < 80,
    patch: { body: 90 },
    label: "Get your body feeling great (exercise, sleep, recovery)",
  },
  {
    condition: (a) => a.workMovement < 40,
    patch: { workMovement: 80 },
    label: "Stand/walk more during your workday",
  },
  {
    condition: (a) => a.workStress > 40,
    patch: { workStress: 15 },
    label: "Find calmer work or better stress recovery",
  },
  {
    condition: (a) => a.closeTies < 5,
    patch: { closeTies: 5 },
    label: "Invest in 5+ deep relationships",
  },
  {
    condition: (a) => a.monday < 80,
    patch: { monday: 90 },
    label: "Find work that lights you up on Monday",
  },
  {
    condition: (a) => a.optimism < 80,
    patch: { optimism: 90 },
    label: "Practice expecting good things",
  },
  {
    condition: (a) => !a.whoopEnabled && (a.exerciseDays ?? 0) < 5,
    patch: { exerciseDays: 5 },
    label: "Get to 5 sweaty days a week",
  },
];

export function findBiggestLever(
  answers: UserAnswers,
  currentExpected: number
): LeverCandidate | null {
  let best: LeverCandidate | null = null;
  let bestDelta = 0.2; // minimum threshold

  for (const test of leverTests) {
    if (!test.condition(answers)) continue;

    const patched = { ...answers, ...test.patch };
    const result = calculate(patched, true); // skipLever to avoid recursion
    const delta = result.expected - currentExpected;

    if (delta > bestDelta) {
      bestDelta = delta;
      best = { label: test.label, deltaYears: delta };
    }
  }

  return best;
}
