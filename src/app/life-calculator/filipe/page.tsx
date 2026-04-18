import type { Metadata } from "next";
import { filipeAnswers, filipeCommentary } from "@/lib/filipe-data";
import { calculate } from "@/lib/calculator";
import { encodeAnswers } from "@/lib/permalink";
import { Container } from "@/components/ui/Container";
import { ShareButton } from "@/components/share/ShareButton";

export const metadata: Metadata = {
  title: "Filipe's Life Calculator",
  description:
    "I built a life calculator for my 40th. Here's what it told me.",
};

export const dynamic = "force-dynamic";

const FILIPE_BIRTHDAY = new Date(1986, 3, 30); // April 30, 1986

function getFilipeAge(): number {
  const now = new Date();
  let age = now.getFullYear() - FILIPE_BIRTHDAY.getFullYear();
  const monthDiff = now.getMonth() - FILIPE_BIRTHDAY.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < FILIPE_BIRTHDAY.getDate())) {
    age--;
  }
  return age;
}

function getCurrentMonthYear(): string {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function FilipePage() {
  const age = getFilipeAge();
  const answers = { ...filipeAnswers, age };
  const result = calculate(answers);
  const encoded = encodeAnswers(answers);
  const shareUrl = `https://www.macedo.app/life-calculator?s=${encoded}`;

  return (
    <Container>
      <article className="py-16 space-y-12">
        {/* Intro */}
        <header className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-serif">
            Filipe&apos;s Life Calculator
          </h1>
          <p className="text-muted leading-relaxed">
            {filipeCommentary.bio}
          </p>
          <p className="text-muted leading-relaxed">
            {filipeCommentary.whyIBuiltThis}
          </p>
          <p className="text-muted leading-relaxed">
            The essay that started it:{" "}
            <a
              href="https://noticedso.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="italic underline hover:text-foreground"
            >
              Forty? Still Early.
            </a>
          </p>
        </header>

        {/* The result */}
        <div className="space-y-6 pt-4">
          <p className="text-sm text-muted">{getCurrentMonthYear()} &middot; Age {age}</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-5xl md:text-6xl font-serif">{Math.round(result.expected)}</p>
              <p className="text-sm text-muted mt-1">years expected</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-serif">{result.percentLived}%</p>
              <p className="text-sm text-muted mt-1">life completed</p>
            </div>
          </div>
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 border border-border rounded-xl text-center">
            <p className="text-2xl font-serif">
              {result.weekendsLeft.toLocaleString()}
            </p>
            <p className="text-xs text-muted mt-1">weekends left</p>
          </div>
          <div className="p-4 border border-border rounded-xl text-center">
            <p className="text-2xl font-serif">{result.booksLeft}</p>
            <p className="text-xs text-muted mt-1">books left to read</p>
          </div>
          <div className="p-4 border border-border rounded-xl text-center">
            <p className="text-2xl font-serif">
              {result.mealsLeft.toLocaleString()}
            </p>
            <p className="text-xs text-muted mt-1">meals left</p>
          </div>
        </div>

        {/* Share + CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="/life-calculator"
            className="px-8 py-3 bg-foreground text-background border border-foreground rounded-lg text-base hover:opacity-90 transition-opacity"
          >
            Try it yourself
          </a>
          <ShareButton
            url={shareUrl}
            percentLived={result.percentLived}
            className="px-8 py-3 border border-foreground rounded-lg text-base hover:bg-foreground hover:text-background transition-colors"
          />
        </div>

        {/* What the math says */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif">What&apos;s adding years</h2>
          {filipeCommentary.whatTheMathSays.map((item) => (
            <div key={item.title} className="space-y-1">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-muted">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif">What&apos;s costing years</h2>
          {filipeCommentary.costingYears.map((item) => (
            <div key={item.title} className="space-y-1">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-muted">{item.text}</p>
            </div>
          ))}
        </section>

        {/* Modifier breakdown */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif">The math, broken down</h2>
          <div className="text-sm">
            <p className="text-muted mb-3">
              Baseline: {result.baseline} years (Portugal, male)
            </p>
            <div className="space-y-2">
              {result.modifiers.map((m) => (
                <div
                  key={m.key}
                  className="flex justify-between py-2 border-b border-border"
                >
                  <span>{m.label}</span>
                  <span
                    className={`font-mono ${
                      m.deltaYears >= 0
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {m.deltaYears >= 0 ? "+" : ""}
                    {m.deltaYears.toFixed(2)}y
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-medium">
                <span>Total modifier</span>
                <span className="font-mono">
                  {result.totalModifier >= 0 ? "+" : ""}
                  {result.totalModifier.toFixed(2)}y
                </span>
              </div>
              <p className="text-muted mt-2">
                Expected: {result.expected.toFixed(1)} years
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-muted pt-8 pb-12">
          <p>{filipeCommentary.disclaimer}</p>
          <a
            href="/life-calculator/methodology"
            className="underline hover:text-foreground mt-2 inline-block"
          >
            Methodology & sources
          </a>
        </footer>
      </article>
    </Container>
  );
}
