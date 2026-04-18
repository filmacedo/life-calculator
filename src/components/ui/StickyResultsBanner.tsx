interface StickyResultsBannerProps {
  expected: number;
  percentLived: number;
  visible: boolean;
}

export function StickyResultsBanner({
  expected,
  percentLived,
  visible,
}: StickyResultsBannerProps) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-foreground text-background py-3 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-2xl mx-auto px-6 flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-serif">{Math.round(expected)}</span>
          <span className="text-sm opacity-60">years expected</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-serif opacity-80">{percentLived}%</span>
          <span className="text-xs opacity-60">life completed</span>
        </div>
      </div>
    </div>
  );
}
