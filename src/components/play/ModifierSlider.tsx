"use client";

import { ModifierResult } from "@/lib/types";

interface ModifierSliderProps {
  modifier: ModifierResult;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  isTopLever: boolean;
}

export function ModifierSlider({
  modifier,
  value,
  onChange,
  min,
  max,
  step,
  isTopLever,
}: ModifierSliderProps) {
  const sign = modifier.deltaYears >= 0 ? "+" : "";
  const yearsBadge = `${sign}${modifier.deltaYears.toFixed(1)}y`;

  return (
    <div
      className={`p-4 rounded-xl border ${
        isTopLever ? "border-accent/40 bg-accent-soft" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <span className="text-sm font-medium">{modifier.label}</span>
          {isTopLever && (
            <span className="ml-2 text-[10px] font-medium text-accent uppercase tracking-wider">
              biggest lever
            </span>
          )}
        </div>
        <span
          className={`text-sm font-mono font-medium ${
            modifier.deltaYears >= 0 ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {yearsBadge}
        </span>
      </div>
      <p className="text-xs text-muted mb-3">{modifier.summary}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${isTopLever ? "lever-highlight" : ""}`}
      />
    </div>
  );
}
