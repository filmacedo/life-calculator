"use client";

import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserAnswers, Sex, SmokingStatus } from "@/lib/types";
import { NumberInput } from "./NumberInput";
import { SexToggle } from "./SexToggle";
import { CountrySelect } from "./CountrySelect";
import { WhoopToggle } from "./WhoopToggle";
import { NumericSliderInput } from "./NumericSliderInput";
import { SliderInput } from "./SliderInput";
import { SnapSliderInput } from "./SnapSliderInput";

interface QuestionFlowProps {
  onComplete: (answers: UserAnswers) => void;
}

type PartialAnswers = {
  age: number | null;
  sex: Sex | null;
  country: string;
  whoopEnabled: boolean;
  whoopAge: number | null;
  exerciseDays: number | null;
  sleepHours: number | null;
  smoking: SmokingStatus;
  upf: number;
  body: number;
  workMovement: number;
  workStress: number;
  closeTies: number;
  monday: number;
  optimism: number;
};

const defaultAnswers: PartialAnswers = {
  age: null,
  sex: null,
  country: "",
  whoopEnabled: false,
  whoopAge: null,
  exerciseDays: 3,
  sleepHours: 7,
  smoking: 0,
  upf: 50,
  body: 50,
  workMovement: 50,
  workStress: 50,
  closeTies: 2,
  monday: 50,
  optimism: 50,
};

interface QuestionDef {
  key: string;
  label: string;
  help?: string;
  skip?: (a: PartialAnswers) => boolean;
  canProceed: (a: PartialAnswers) => boolean;
  render: (
    a: PartialAnswers,
    update: (patch: Partial<PartialAnswers>) => void
  ) => React.ReactNode;
}

const questions: QuestionDef[] = [
  {
    key: "age",
    label: "How old are you?",
    canProceed: (a) => a.age !== null && a.age >= 18 && a.age <= 100,
    render: (a, update) => (
      <NumberInput
        value={a.age}
        onChange={(v) => update({ age: v })}
        min={18}
        max={100}
        placeholder="30"
      />
    ),
  },
  {
    key: "sex",
    label: "Biological sex?",
    canProceed: (a) => a.sex !== null,
    render: (a, update) => (
      <SexToggle value={a.sex} onChange={(v) => update({ sex: v })} />
    ),
  },
  {
    key: "country",
    label: "Where have you lived most of your life?",
    canProceed: (a) => a.country !== "",
    render: (a, update) => (
      <CountrySelect
        value={a.country}
        onChange={(v) => update({ country: v })}
      />
    ),
  },
  {
    key: "whoop",
    label: "Whoop Age",
    help: "Your biological age, not your birthday age. Found in the Whoop app under Health.",
    canProceed: (a) =>
      a.whoopEnabled ? a.whoopAge !== null : true,
    render: (a, update) => (
      <div className="space-y-6">
        <WhoopToggle
          enabled={a.whoopEnabled}
          onChange={(v) => update({ whoopEnabled: v })}
        />
        {a.whoopEnabled ? (
          <NumberInput
            value={a.whoopAge}
            onChange={(v) => update({ whoopAge: v })}
            min={18}
            max={100}
            step={0.1}
            placeholder="35.0"
          />
        ) : (
          <p className="text-sm text-muted">
            No Whoop? These two questions get us close.
          </p>
        )}
      </div>
    ),
  },
  {
    key: "exerciseDays",
    label: "Days a week you actually sweat (from exercise)",
    help: "Vigorous = can\u2019t hold a full conversation while doing it. Running, sports, lifting with effort, HIIT.",
    skip: (a) => a.whoopEnabled,
    canProceed: () => true,
    render: (a, update) => (
      <NumericSliderInput
        value={a.exerciseDays ?? 3}
        onChange={(v) => update({ exerciseDays: v })}
        min={0}
        max={7}
        step={1}
        anchors={["0", "3\u20134", "7"]}
      />
    ),
  },
  {
    key: "sleepHours",
    label: "Sleep on an average night",
    skip: (a) => a.whoopEnabled,
    canProceed: () => true,
    render: (a, update) => (
      <NumericSliderInput
        value={a.sleepHours ?? 7}
        onChange={(v) => update({ sleepHours: v })}
        min={4}
        max={10}
        step={0.5}
        anchors={["under 5h", "7h", "9h+"]}
        formatValue={(v) => `${v}h`}
      />
    ),
  },
  {
    key: "smoking",
    label: "Your relationship with cigarettes?",
    canProceed: () => true,
    render: (a, update) => (
      <SnapSliderInput
        value={a.smoking}
        onChange={(v) => update({ smoking: v as SmokingStatus })}
        options={["never", "quit 10+ yrs ago", "quit more recently", "daily"]}
      />
    ),
  },
  {
    key: "upf",
    label: "How much packaged food do you eat?",
    help: "Think: bread from a bakery vs. bread from a bag that lasts 3 weeks.",
    canProceed: () => true,
    render: (a, update) => (
      <SliderInput
        value={a.upf}
        onChange={(v) => update({ upf: v })}
        anchors={["almost none", "some of it", "most of it"]}
      />
    ),
  },
  {
    key: "body",
    label: "Overall, how would you rate your health?",
    help: "Not right now in this moment \u2014 think about the last year or so. Energy levels, how often you get sick, chronic issues, general fitness.",
    canProceed: () => true,
    render: (a, update) => (
      <SliderInput
        value={a.body}
        onChange={(v) => update({ body: v })}
        anchors={["poor", "okay", "excellent"]}
      />
    ),
  },
  {
    key: "workMovement",
    label: "A typical day at work, you\u2019re...",
    help: "If you don\u2019t work, think about how you spend most of your day.",
    canProceed: () => true,
    render: (a, update) => (
      <SliderInput
        value={a.workMovement}
        onChange={(v) => update({ workMovement: v })}
        anchors={["mostly sitting", "mix of both", "mostly moving"]}
      />
    ),
  },
  {
    key: "workStress",
    label: "Your stress level at work",
    help: "If you don\u2019t work, think about your usual week overall.",
    canProceed: () => true,
    render: (a, update) => (
      <SliderInput
        value={a.workStress}
        onChange={(v) => update({ workStress: v })}
        anchors={["calm", "normal ups and downs", "chronically fried"]}
      />
    ),
  },
  {
    key: "closeTies",
    label: "People you could call at 3am if things fell apart",
    help: "Not acquaintances. People who\u2019d actually pick up.",
    canProceed: () => true,
    render: (a, update) => (
      <NumericSliderInput
        value={a.closeTies}
        onChange={(v) => update({ closeTies: v })}
        min={0}
        max={5}
        step={1}
        anchors={["0", "3", "5+"]}
        formatValue={(v) => (v === 5 ? "5+" : String(v))}
      />
    ),
  },
  {
    key: "monday",
    label: "How do Monday mornings feel?",
    canProceed: () => true,
    render: (a, update) => (
      <SliderInput
        value={a.monday}
        onChange={(v) => update({ monday: v })}
        anchors={["I dread them", "mixed", "energizing"]}
      />
    ),
  },
  {
    key: "optimism",
    label: "Generally, how do you see the future?",
    help: "Not your personal plans. Your gut feeling about how things tend to work out.",
    canProceed: () => true,
    render: (a, update) => (
      <SliderInput
        value={a.optimism}
        onChange={(v) => update({ optimism: v })}
        anchors={["expect hard times", "mixed", "expect good things"]}
      />
    ),
  },
];

export function QuestionFlow({ onComplete }: QuestionFlowProps) {
  const [answers, setAnswers] = useState<PartialAnswers>(defaultAnswers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const activeQuestions = useMemo(
    () => questions.filter((q) => !q.skip?.(answers)),
    [answers]
  );

  const current = activeQuestions[currentIndex];
  const isLast = currentIndex === activeQuestions.length - 1;
  const canProceed = current?.canProceed(answers);
  const totalQuestions = activeQuestions.length;

  const update = useCallback((patch: Partial<PartialAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }, []);

  const next = useCallback(() => {
    if (!canProceed) return;
    if (isLast) {
      const finalAnswers: UserAnswers = {
        age: answers.age!,
        sex: answers.sex!,
        country: answers.country,
        whoopEnabled: answers.whoopEnabled,
        whoopAge: answers.whoopEnabled ? answers.whoopAge : null,
        exerciseDays: answers.whoopEnabled ? null : answers.exerciseDays,
        sleepHours: answers.whoopEnabled ? null : answers.sleepHours,
        smoking: answers.smoking,
        upf: answers.upf,
        body: answers.body,
        workMovement: answers.workMovement,
        workStress: answers.workStress,
        closeTies: answers.closeTies,
        monday: answers.monday,
        optimism: answers.optimism,
      };
      onComplete(finalAnswers);
    } else {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [canProceed, isLast, answers, onComplete, currentIndex]);

  const back = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  if (!current) return null;

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-border">
          <div
            className="h-full bg-foreground transition-all duration-300 ease-out"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
        <div className="text-center py-3">
          <span className="text-xs font-medium tracking-wider text-muted uppercase">
            How Much Life Left?
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.key}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-3 leading-snug">
                {current.label}
              </h2>
              {current.help && (
                <p className="text-sm text-muted mb-8">{current.help}</p>
              )}
              {!current.help && <div className="mb-8" />}

              {current.render(answers, update)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-between items-center max-w-lg mx-auto">
        <button
          onClick={back}
          className={`text-sm text-muted hover:text-foreground transition-colors ${
            currentIndex === 0 ? "invisible" : ""
          }`}
        >
          Back
        </button>
        <button
          onClick={next}
          disabled={!canProceed}
          className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${
            canProceed
              ? "bg-foreground text-background hover:opacity-90"
              : "bg-border text-muted cursor-not-allowed"
          }`}
        >
          {isLast ? "See your results" : "Next"}
        </button>
      </div>
    </div>
  );
}
