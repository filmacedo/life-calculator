"use client";

import { useMemo } from "react";

interface MonthsGridProps {
  ageMonths: number; // age * 12
  totalMonths: number; // expected * 12
}

export function MonthsGrid({ ageMonths, totalMonths }: MonthsGridProps) {
  const totalYears = Math.ceil(totalMonths / 12);
  const halfPoint = Math.ceil(totalYears / 2);

  const dots = useMemo(() => {
    const result: Array<{ index: number; state: "filled" | "current" | "outlined" }> = [];
    for (let i = 0; i < totalYears * 12; i++) {
      let state: "filled" | "current" | "outlined";
      if (i < ageMonths) state = "filled";
      else if (i === ageMonths) state = "current";
      else state = "outlined";
      result.push({ index: i, state });
    }
    return result;
  }, [ageMonths, totalMonths, totalYears]);

  const leftDots = dots.filter((d) => Math.floor(d.index / 12) < halfPoint);
  const rightDots = dots.filter((d) => Math.floor(d.index / 12) >= halfPoint);

  return (
    <div className="space-y-4">
      <div className="flex gap-6 md:gap-10 justify-center">
        <DotColumn dots={leftDots} startYear={0} />
        <DotColumn dots={rightDots} startYear={halfPoint} />
      </div>
      <div className="flex justify-center gap-6 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-dot-filled" /> lived
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent" /> now
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full border border-dot-outlined" />{" "}
          ahead
        </span>
      </div>
    </div>
  );
}

function DotColumn({
  dots,
  startYear,
}: {
  dots: Array<{ index: number; state: "filled" | "current" | "outlined" }>;
  startYear: number;
}) {
  const rows: Array<typeof dots> = [];
  for (let i = 0; i < dots.length; i += 12) {
    rows.push(dots.slice(i, i + 12));
  }

  return (
    <div className="flex flex-col gap-[2px]">
      {rows.map((row, rowIdx) => {
        const year = startYear + rowIdx;
        const isDecade = year % 10 === 0;
        return (
          <div key={rowIdx} className="flex items-center">
            <span
              className={`w-6 text-right mr-1.5 flex-shrink-0 tabular-nums ${
                isDecade
                  ? "text-[9px] text-muted"
                  : "text-[9px] text-transparent select-none"
              }`}
            >
              {isDecade ? year : "\u00A0"}
            </span>
            <div className="flex gap-[3px]">
              {row.map((dot) => (
                <span
                  key={dot.index}
                  className={`w-[5px] h-[5px] md:w-[6px] md:h-[6px] rounded-full flex-shrink-0 ${
                    dot.state === "filled"
                      ? "bg-dot-filled"
                      : dot.state === "current"
                        ? "bg-accent"
                        : "border border-dot-outlined"
                  }`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
