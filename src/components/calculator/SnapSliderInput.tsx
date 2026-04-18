"use client";

interface SnapSliderInputProps {
  value: number;
  onChange: (value: number) => void;
  options: string[];
  className?: string;
}

export function SnapSliderInput({
  value,
  onChange,
  options,
  className,
}: SnapSliderInputProps) {
  return (
    <div className={className}>
      <div className="flex gap-2">
        {options.map((label, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`flex-1 py-3 px-2 text-sm rounded-lg border transition-colors ${
              value === i
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-foreground border-border hover:border-foreground/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
