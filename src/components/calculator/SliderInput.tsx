"use client";

interface SliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  anchors: [string, string, string];
  className?: string;
}

export function SliderInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  anchors,
  className,
}: SliderInputProps) {
  return (
    <div className={className}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between mt-2 text-sm text-muted">
        <span>{anchors[0]}</span>
        <span>{anchors[1]}</span>
        <span>{anchors[2]}</span>
      </div>
    </div>
  );
}
