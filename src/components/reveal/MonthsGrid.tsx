"use client";

import { useMemo } from "react";

interface MonthsGridProps {
  ageMonths: number; // age * 12
  totalMonths: number; // expected * 12
}

type Dot = { index: number; state: "filled" | "current" | "outlined"; col: number; row: number };

const LABEL_YEARS = [0, 20, 40, 60, 80];

export function MonthsGrid({ ageMonths, totalMonths }: MonthsGridProps) {
  const totalYears = Math.ceil(totalMonths / 12);
  const monthsBehind = ageMonths;
  const monthsAhead = totalYears * 12 - ageMonths;

  // Transpose into 12 rows × totalYears columns
  // Column = year, Row = month within year
  const dots = useMemo<Dot[]>(() => {
    const result: Dot[] = [];
    for (let m = 0; m < 12; m++) {
      for (let y = 0; y < totalYears; y++) {
        const idx = y * 12 + m;
        let state: Dot["state"];
        if (idx < ageMonths) state = "filled";
        else if (idx === ageMonths) state = "current";
        else state = "outlined";
        result.push({ index: idx, state, col: y, row: m });
      }
    }
    return result;
  }, [ageMonths, totalYears]);

  const visibleLabels = LABEL_YEARS.filter((y) => y < totalYears);

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-muted">
        <span className="text-foreground tabular-nums">{monthsBehind.toLocaleString()}</span> months behind you,{" "}
        <span className="text-foreground tabular-nums">{monthsAhead.toLocaleString()}</span> to look forward to.
      </p>

      <div className="relative mx-auto w-full pt-5">
        {/* Labels on top */}
        <div className="absolute top-0 left-0 right-0 h-4">
          {visibleLabels.map((y) => (
            <span
              key={y}
              className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[10px] leading-none text-muted tabular-nums"
              style={{ left: `${((y + 0.5) / totalYears) * 100}%` }}
            >
              {y}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div
          className="grid gap-[1px] w-full"
          style={{
            gridTemplateColumns: `repeat(${totalYears}, 1fr)`,
            gridTemplateRows: `repeat(12, 1fr)`,
            aspectRatio: `${totalYears} / 12`,
          }}
        >
          {dots.map((dot) => (
            <span
              key={dot.index}
              style={{ gridColumn: dot.col + 1, gridRow: dot.row + 1 }}
              className={`rounded-[1px] ${
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

      <div className="flex justify-center gap-6 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[1px] bg-dot-filled" /> lived
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[1px] bg-accent" /> now
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[1px] border border-dot-outlined" />{" "}
          ahead
        </span>
      </div>
    </div>
  );
}
