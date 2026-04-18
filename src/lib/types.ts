export type Sex = "male" | "female";
export type SmokingStatus = 0 | 1 | 2 | 3; // never | quit 10+ | quit recently | daily
export type Phase = "input" | "reveal" | "play";

export interface UserAnswers {
  age: number; // 18-100
  sex: Sex;
  country: string; // country code
  whoopEnabled: boolean;
  whoopAge: number | null; // 18-100, step 0.1
  exerciseDays: number | null; // 0-7 integer (fallback)
  sleepHours: number | null; // 4-10, step 0.5 (fallback)
  smoking: SmokingStatus; // 4-point snap
  upf: number; // 0-100
  body: number; // 0-100
  workMovement: number; // 0-100
  workStress: number; // 0-100
  closeTies: number; // 0-5
  monday: number; // 0-100
  optimism: number; // 0-100
}

export interface ModifierResult {
  key: string;
  label: string;
  deltaYears: number;
  summary: string; // short human-readable summary for play mode
}

export interface LeverCandidate {
  label: string;
  deltaYears: number;
}

export interface CalculatorResult {
  baseline: number;
  modifiers: ModifierResult[];
  totalModifier: number;
  expected: number;
  percentLived: number;
  yearsLeft: number;
  weekendsLeft: number;
  booksLeft: number;
  mealsLeft: number;
  biggestLever: LeverCandidate | null;
}

export interface CountryData {
  code: string;
  name: string;
  male: number;
  female: number;
}
