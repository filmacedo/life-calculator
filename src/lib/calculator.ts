import { UserAnswers, CalculatorResult } from "./types";
import { getCountry } from "./countries";
import { computeModifiers } from "./modifiers";
import { findBiggestLever } from "./top-lever";

export function calculate(
  answers: UserAnswers,
  skipLever = false
): CalculatorResult {
  const country = getCountry(answers.country);
  const baseline = country
    ? country[answers.sex]
    : answers.sex === "male"
      ? 75
      : 80;

  const modifiers = computeModifiers(answers);
  const totalModifier = modifiers.reduce((sum, m) => sum + m.deltaYears, 0);
  const expected = Math.max(answers.age + 1, baseline + totalModifier);
  const percentLived = Math.min(99, Math.round((answers.age / expected) * 100));
  const yearsLeft = expected - answers.age;
  const weekendsLeft = Math.round(yearsLeft * 52);
  const booksLeft = Math.round(yearsLeft * 4); // ~4 books/year average reader
  const mealsLeft = Math.round(yearsLeft * 365 * 3);

  const biggestLever = skipLever
    ? null
    : findBiggestLever(answers, expected);

  return {
    baseline,
    modifiers,
    totalModifier,
    expected,
    percentLived,
    yearsLeft,
    weekendsLeft,
    booksLeft,
    mealsLeft,
    biggestLever,
  };
}
