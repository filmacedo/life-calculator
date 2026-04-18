import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";

interface PageProps {
  searchParams: Promise<{ s?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasResult = !!params.s;

  return {
    title: hasResult ? "My Result — How Much Life Left?" : "How Much Life Left?",
    description:
      "A playful estimate of how much life is still ahead of you.",
    openGraph: {
      title: "How Much Life Left?",
      description: "A playful estimate of how much life is still ahead of you.",
      images: params.s
        ? [`/life-calculator/og?s=${params.s}`]
        : ["/life-calculator/og"],
    },
  };
}

export default async function LifeCalculatorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <Calculator initialParam={params.s ?? null} />;
}
