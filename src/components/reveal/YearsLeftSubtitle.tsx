interface YearsLeftSubtitleProps {
  yearsLeft: number;
  age: number;
}

export function YearsLeftSubtitle({ yearsLeft, age }: YearsLeftSubtitleProps) {
  return (
    <p className="text-center text-lg text-muted">
      {Math.round(age)} years behind you, ~{Math.round(yearsLeft)} ahead
    </p>
  );
}
