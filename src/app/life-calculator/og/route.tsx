import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { decodeAnswers } from "@/lib/permalink";
import { calculate } from "@/lib/calculator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const encoded = searchParams.get("s");

  let percent: number | null = null;
  let yearsLeft: number | null = null;
  let expected: number | null = null;

  if (encoded) {
    const answers = decodeAnswers(encoded);
    if (answers) {
      const result = calculate(answers, true);
      percent = result.percentLived;
      yearsLeft = Math.round(result.yearsLeft);
      expected = Math.round(result.expected);
    }
  }

  const hasData = percent !== null && yearsLeft !== null && expected !== null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafaf7",
          padding: "60px",
          position: "relative",
        }}
      >
        <div style={{ fontSize: hasData ? 160 : 72, color: "#1a1a1a", lineHeight: 1, fontFamily: "Georgia, serif" }}>
          {hasData ? `${percent}%` : "How Much Life Left?"}
        </div>
        {hasData && (
          <div style={{ fontSize: 24, color: "#6b6b6b", marginTop: 10, letterSpacing: "0.08em", fontFamily: "system-ui, sans-serif" }}>
            LIFE COMPLETED
          </div>
        )}
        {hasData && (
          <div style={{ display: "flex", width: 1080, height: 10, marginTop: 52, backgroundColor: "#e4e4e0", borderRadius: 5 }}>
            <div style={{ width: `${percent}%`, height: 10, backgroundColor: "#1a1a1a", borderRadius: 5 }} />
          </div>
        )}
        {hasData && (
          <div style={{ fontSize: 26, color: "#6b6b6b", marginTop: 44, fontFamily: "system-ui, sans-serif" }}>
            {`${expected} life expectancy · ${yearsLeft} years left`}
          </div>
        )}
        <div
          style={{
            fontSize: 20,
            color: "#9b9b93",
            position: "absolute",
            bottom: 44,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          macedo.app/life-calculator
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
