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

  const title = hasResult
    ? "My Life Calculator Result — How Much Time I Have Left"
    : "How Much Life Left? Your Life in Months, Weekends, Meals";
  const description =
    "A playful, honest estimate of the years still ahead of you — based on your age, habits, and country.";
  const ogImage = params.s
    ? `/life-calculator/og?s=${params.s}&theme=dark`
    : "/life-calculator/og?theme=dark";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function LifeCalculatorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <Calculator initialParam={params.s ?? null} />;
}
