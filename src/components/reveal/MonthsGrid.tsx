"use client";

import { useMemo } from "react";

interface MonthsGridProps {
  ageMonths: number; // age * 12
  totalMonths: number; // expected * 12
}

type Dot = { index: number; state: "filled" | "current" | "outlined" };

export function MonthsGrid({ ageMonths, totalMonths }: MonthsGridProps) {
  const totalYears = Math.ceil(totalMonths / 12);

  const dots = useMemo<Dot[]>(() => {
    const result: Dot[] = [];
    for (let i = 0; i < totalYears * 12; i++) {
      let state: Dot["state"];
      if (i < ageMonths) state = "filled";
      else if (i === ageMonths) state = "current";
      else state = "outlined";
      result.push({ index: i, state });
    }
    return result;
  }, [ageMonths, totalYears]);

  const mobileColumns = splitYearsIntoColumns(totalYears, 2);
  const desktopColumns = splitYearsIntoColumns(totalYears, 4);

  return (
    <div className="space-y-4">
      {/* Mobile: 2 columns */}
      <div className="md:hidden flex gap-6 justify-center">
        {renderColumns(dots, mobileColumns)}
      </div>

      {/* Desktop: 4 columns */}
      <div className="hidden md:flex gap-8 justify-center">
        {renderColumns(dots, desktopColumns)}
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

function splitYearsIntoColumns(totalYears: number, numCols: number): number[] {
  const perCol = Math.ceil(totalYears / numCols);
  const result: number[] = [];
  let remaining = totalYears;
  for (let i = 0; i < numCols; i++) {
    const size = Math.min(perCol, Math.max(remaining, 0));
    result.push(size);
    remaining -= size;
  }
  return result;
}

function renderColumns(dots: Dot[], columnSizes: number[]) {
  let yearCursor = 0;
  return columnSizes.map((yearCount, colIdx) => {
    const startYear = yearCursor;
    const colDots = dots.slice(startYear * 12, (startYear + yearCount) * 12);
    yearCursor += yearCount;
    return (
      <DotColumn
        key={colIdx}
        dots={colDots}
        startYear={startYear}
      />
    );
  });
}

function DotColumn({
  dots,
  startYear,
}: {
  dots: Dot[];
  startYear: number;
}) {
  const rows: Dot[][] = [];
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
