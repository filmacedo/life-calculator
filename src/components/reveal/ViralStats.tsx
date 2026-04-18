interface ViralStatsProps {
  weekendsLeft: number;
  booksLeft: number;
  mealsLeft: number;
}

export function ViralStats({ weekendsLeft, booksLeft, mealsLeft }: ViralStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="text-center p-4 border border-border rounded-xl">
        <p className="text-2xl md:text-3xl font-serif">
          ~{weekendsLeft.toLocaleString()}
        </p>
        <p className="text-xs text-muted mt-1">weekends left</p>
      </div>
      <div className="text-center p-4 border border-border rounded-xl">
        <p className="text-2xl md:text-3xl font-serif">~{booksLeft}</p>
        <p className="text-xs text-muted mt-1">books left to read</p>
      </div>
      <div className="text-center p-4 border border-border rounded-xl">
        <p className="text-2xl md:text-3xl font-serif">
          ~{mealsLeft.toLocaleString()}
        </p>
        <p className="text-xs text-muted mt-1">meals left</p>
      </div>
    </div>
  );
}
