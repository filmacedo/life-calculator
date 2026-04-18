"use client";

interface NumericSliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  anchors: [string, string, string];
  formatValue?: (value: number) => string;
  className?: string;
}

export function NumericSliderInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  anchors,
  formatValue,
  className,
}: NumericSliderInputProps) {
  const percent = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : String(value);

  return (
    <div className={className}>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
        <div
          className="absolute -top-8 -translate-x-1/2 bg-foreground text-background text-xs font-medium px-2 py-1 rounded pointer-events-none"
          style={{ left: `${percent}%` }}
        >
          {display}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-muted">
        <span>{anchors[0]}</span>
        <span>{anchors[1]}</span>
        <span>{anchors[2]}</span>
      </div>
    </div>
  );
}
