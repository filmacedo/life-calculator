"use client";

interface WhoopToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

export function WhoopToggle({
  enabled,
  onChange,
  className,
}: WhoopToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-3 ${className ?? ""}`}
    >
      <div
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? "bg-foreground" : "bg-border"
        }`}
      >
        <div
          className={`absolute top-0.5 w-6 h-6 bg-background rounded-full transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-base text-foreground">I wear a Whoop</span>
    </button>
  );
}
