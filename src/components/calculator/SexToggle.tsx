"use client";

import { Sex } from "@/lib/types";

interface SexToggleProps {
  value: Sex | null;
  onChange: (value: Sex) => void;
  className?: string;
}

export function SexToggle({ value, onChange, className }: SexToggleProps) {
  return (
    <div className={`flex gap-3 ${className ?? ""}`}>
      {(["female", "male"] as const).map((sex) => (
        <button
          key={sex}
          onClick={() => onChange(sex)}
          className={`flex-1 py-3 px-6 text-lg rounded-lg border transition-colors ${
            value === sex
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-foreground border-border hover:border-foreground/40"
          }`}
        >
          {sex}
        </button>
      ))}
    </div>
  );
}
