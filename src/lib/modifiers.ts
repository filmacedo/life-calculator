import { UserAnswers, ModifierResult } from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function computeModifiers(answers: UserAnswers): ModifierResult[] {
  const results: ModifierResult[] = [];

  if (answers.whoopEnabled && answers.whoopAge !== null) {
    const delta = clamp((answers.age - answers.whoopAge) * 0.6, -7, 7);
    results.push({
      key: "whoopAge",
      label: "Biological age (Whoop)",
      deltaYears: delta,
      summary:
        delta >= 0
          ? `Body is ${Math.abs(answers.age - answers.whoopAge).toFixed(1)} years younger`
          : `Body is ${Math.abs(answers.age - answers.whoopAge).toFixed(1)} years older`,
    });
  }

  if (!answers.whoopEnabled) {
    if (answers.exerciseDays !== null) {
      const delta = (answers.exerciseDays / 7) * 4.5 - 1.5;
      results.push({
        key: "exercise",
        label: "Exercise",
        deltaYears: delta,
        summary: `${answers.exerciseDays} sweaty days a week`,
      });
    }

    if (answers.sleepHours !== null) {
      let delta: number;
      if (answers.sleepHours < 6) delta = -2;
      else if (answers.sleepHours < 7) delta = 0;
      else if (answers.sleepHours <= 8) delta = 1;
      else delta = 0;
      results.push({
        key: "sleep",
        label: "Sleep",
        deltaYears: delta,
        summary: `${answers.sleepHours}h per night`,
      });
    }
  }

  // Smoking: [0, 0, -3, -10]
  const smokingDeltas = [0, 0, -3, -10];
  const smokingLabels = [
    "Never smoked",
    "Quit 10+ years ago",
    "Quit more recently",
    "Daily smoker",
  ];
  results.push({
    key: "smoking",
    label: "Smoking",
    deltaYears: smokingDeltas[answers.smoking],
    summary: smokingLabels[answers.smoking],
  });

  // Ultra-processed food: 1.5 - (upf/100) * 4
  const upfDelta = 1.5 - (answers.upf / 100) * 4;
  results.push({
    key: "upf",
    label: "Ultra-processed food",
    deltaYears: upfDelta,
    summary:
      answers.upf < 30
        ? "Mostly whole food"
        : answers.upf < 60
          ? "Mixed diet"
          : "Mostly processed",
  });

  // Self-rated health: -5 + (body/100) * 8
  const bodyDelta = -5 + (answers.body / 100) * 8;
  results.push({
    key: "body",
    label: "Self-rated health",
    deltaYears: bodyDelta,
    summary:
      answers.body < 30
        ? "Not feeling great"
        : answers.body < 60
          ? "Feeling okay"
          : "Feeling great",
  });

  // Work movement: -1 + (workMovement/100) * 2
  const movementDelta = -1 + (answers.workMovement / 100) * 2;
  results.push({
    key: "workMovement",
    label: "Work movement",
    deltaYears: movementDelta,
    summary:
      answers.workMovement < 30
        ? "Mostly sitting"
        : answers.workMovement < 60
          ? "Mix of both"
          : "Mostly moving",
  });

  // Work stress: 1 - (workStress/100) * 4
  const stressDelta = 1 - (answers.workStress / 100) * 4;
  results.push({
    key: "workStress",
    label: "Work stress",
    deltaYears: stressDelta,
    summary:
      answers.workStress < 30
        ? "Calm"
        : answers.workStress < 60
          ? "Normal ups and downs"
          : "Chronically stressed",
  });

  // Close ties: -3 + (closeTies/5) * 6
  const tiesDelta = -3 + (answers.closeTies / 5) * 6;
  results.push({
    key: "closeTies",
    label: "Close relationships",
    deltaYears: tiesDelta,
    summary: `${answers.closeTies === 5 ? "5+" : answers.closeTies} people you can call at 3am`,
  });

  // Monday mornings: -2 + (monday/100) * 5
  const mondayDelta = -2 + (answers.monday / 100) * 5;
  results.push({
    key: "monday",
    label: "Monday mornings",
    deltaYears: mondayDelta,
    summary:
      answers.monday < 30
        ? "Dreading them"
        : answers.monday < 60
          ? "Mixed feelings"
          : "Energizing",
  });

  // Optimism: -2 + (optimism/100) * 5
  const optimismDelta = -2 + (answers.optimism / 100) * 5;
  results.push({
    key: "optimism",
    label: "Optimism",
    deltaYears: optimismDelta,
    summary:
      answers.optimism < 30
        ? "Expecting hard times"
        : answers.optimism < 60
          ? "Mixed outlook"
          : "Expecting good things",
  });

  return results;
}
