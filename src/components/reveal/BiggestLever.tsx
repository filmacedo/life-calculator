import { LeverCandidate } from "@/lib/types";

interface BiggestLeverProps {
  lever: LeverCandidate | null;
}

export function BiggestLever({ lever }: BiggestLeverProps) {
  if (!lever) return null;

  return (
    <div className="border border-accent/30 bg-accent-soft rounded-xl p-6">
      <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
        Biggest lever
      </p>
      <p className="text-lg font-serif">{lever.label}</p>
      <p className="text-sm text-muted mt-1">
        Could add ~{lever.deltaYears.toFixed(1)} years
      </p>
    </div>
  );
}
