"use client";

interface StagesBarProps {
  age: number;
}

const stages = [
  { label: "childhood", start: 0, end: 12, color: "bg-amber-100" },
  { label: "youth", start: 12, end: 25, color: "bg-emerald-100" },
  { label: "prime", start: 25, end: 50, color: "bg-sky-100" },
  { label: "middle", start: 50, end: 65, color: "bg-violet-100" },
  { label: "elder", start: 65, end: 100, color: "bg-rose-100" },
];

export function StagesBar({ age }: StagesBarProps) {
  const markerPercent = Math.min(100, Math.max(0, age));

  return (
    <div className="space-y-1">
      {/* Labels above the bar */}
      <div className="flex text-[10px] text-muted">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className="text-center"
            style={{ width: `${stage.end - stage.start}%` }}
          >
            {stage.label}
          </div>
        ))}
      </div>

      {/* Bar */}
      <div className="relative">
        <div className="flex h-8 rounded-full overflow-hidden">
          {stages.map((stage) => (
            <div
              key={stage.label}
              className={stage.color}
              style={{ width: `${stage.end - stage.start}%` }}
            />
          ))}
        </div>

        {/* Marker line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-foreground pointer-events-none"
          style={{ left: `${markerPercent}%` }}
        />
      </div>

      {/* "you" label below the bar, centred on marker */}
      <div className="relative h-5">
        <div
          className="absolute top-1 text-xs font-medium text-foreground whitespace-nowrap -translate-x-1/2"
          style={{ left: `${markerPercent}%` }}
        >
          you ({age})
        </div>
      </div>
    </div>
  );
}
