import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Life Calculator — Methodology",
  description: "How the Life Calculator works: formulas, ranges, and sources.",
};

const modifiers = [
  {
    name: "Biological age (Whoop)",
    formula: "clamp((chronological age − Whoop Age) × 0.6, −7, +7)",
    range: "−7 to +7 years",
    notes:
      "The 0.6 coefficient is a semi-serious estimate based on biological age research, not a published figure.",
    citation:
      "PhenoAge (Levine et al. 2018), DunedinPACE (Belsky et al. 2022)",
  },
  {
    name: "Exercise (fallback)",
    formula: "(exerciseDays / 7) × 4.5 − 1.5",
    range: "−1.5 to +3 years",
    notes: "Used when Whoop Age is not available. Based on vigorous exercise days per week.",
    citation: "WHO Physical Activity Guidelines; meta-analyses on exercise and mortality",
  },
  {
    name: "Sleep (fallback)",
    formula: "<6h: −2y; 6–7h: 0; 7–8h: +1y; >8h: 0",
    range: "−2 to +1 years",
    notes: "Used when Whoop Age is not available. The sweet spot is 7–8 hours.",
    citation: "Walker, Why We Sleep (2017); Cappuccio et al. meta-analysis",
  },
  {
    name: "Smoking",
    formula: "never: 0; quit 10+: 0; quit recently: −3y; daily: −10y",
    range: "−10 to 0 years",
    notes:
      "Quit 10+ years is treated as never-smoker. Research supports this — mortality risk converges.",
    citation: "Doll & Peto, BMJ 2004",
  },
  {
    name: "Ultra-processed food",
    formula: "1.5 − (upf% / 100) × 4",
    range: "+1.5 to −2.5 years",
    notes: "Based on the NOVA classification system for food processing levels.",
    citation: "Monteiro NOVA classification; Lancet 2019 UPF mortality meta-analysis",
  },
  {
    name: "Self-rated health",
    formula: "−5 + (body / 100) × 8",
    range: "−5 to +3 years",
    notes:
      "Self-rated health is one of the strongest predictors of mortality, even after controlling for objective health measures.",
    citation: "Idler & Benyamini, J Health Soc Behav 1997",
  },
  {
    name: "Work movement",
    formula: "−1 + (workMovement / 100) × 2",
    range: "−1 to +1 years",
    notes: "Sedentary work is associated with increased mortality independent of exercise habits.",
    citation: "Whitehall II (Marmot et al.)",
  },
  {
    name: "Work stress",
    formula: "1 − (workStress / 100) × 4",
    range: "+1 to −3 years",
    notes:
      "Chronic work stress, especially with low control, is associated with cardiovascular disease and mortality.",
    citation: "Whitehall II (Marmot et al.)",
  },
  {
    name: "Close relationships",
    formula: "−3 + (closeTies / 5) × 6",
    range: "−3 to +3 years",
    notes:
      "Social isolation is equivalent to approximately 15 cigarettes per day in mortality risk.",
    citation: "Holt-Lunstad et al., PLoS Medicine 2010",
  },
  {
    name: "Monday mornings (purpose)",
    formula: "−2 + (monday / 100) × 5",
    range: "−2 to +3 years",
    notes:
      "How you feel about Monday mornings is a proxy for purpose and engagement with life.",
    citation:
      "Rush Memory Project (Boyle et al. 2009); Sone et al. 2008 on ikigai",
  },
  {
    name: "Optimism",
    formula: "−2 + (optimism / 100) × 5",
    range: "−2 to +3 years",
    notes:
      "Top-quartile optimism correlates with 11–15% longer lifespan in longitudinal studies.",
    citation: "Lee et al., PNAS 2019",
  },
];

export default function MethodologyPage() {
  return (
    <Container>
      <article className="py-16 space-y-12">
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-serif">Methodology</h1>
          <p className="text-muted text-lg">
            This is a playful estimate, not medical advice.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-serif">Baselines</h2>
          <p className="text-muted">
            We use WHO-style life expectancy at birth, broken down by country
            and biological sex. Around 200 countries are included, with a
            &ldquo;Somewhere else&rdquo; fallback (male: 75, female: 80).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif">Result formula</h2>
          <div className="bg-foreground/5 rounded-xl p-4 font-mono text-sm space-y-1">
            <p>expected = max(age + 1, baseline + totalModifier)</p>
            <p>percentLived = min(99, round(age / expected × 100))</p>
            <p>yearsLeft = expected − age</p>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-serif">Modifiers</h2>
          {modifiers.map((m) => (
            <div key={m.name} className="space-y-2 pb-6 border-b border-border">
              <h3 className="font-medium">{m.name}</h3>
              <p className="font-mono text-sm text-muted">{m.formula}</p>
              <p className="text-sm">
                <span className="text-muted">Range: </span>
                {m.range}
              </p>
              <p className="text-sm text-muted">{m.notes}</p>
              <p className="text-sm">
                <span className="text-muted">Source: </span>
                <em>{m.citation}</em>
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif">Biggest lever algorithm</h2>
          <p className="text-muted">
            After computing your result, we test a set of improvement scenarios
            (e.g., &ldquo;what if you quit smoking?&rdquo;, &ldquo;what if you
            got to 5 sweaty days a week?&rdquo;). The scenario that produces the
            largest increase in expected years is shown as your biggest lever. If
            no scenario would add more than 0.2 years, the lever card is hidden.
          </p>
        </section>

        <div className="text-center pt-8">
          <a
            href="/life-calculator"
            className="inline-block px-8 py-3 bg-foreground text-background rounded-lg text-base hover:opacity-90 transition-opacity"
          >
            Try the calculator
          </a>
        </div>

        <footer className="text-center text-xs text-muted pt-8 pb-12">
          <a
            href="/life-calculator/filipe"
            className="underline hover:text-foreground"
          >
            See how the creator scored
          </a>
        </footer>
      </article>
    </Container>
  );
}
