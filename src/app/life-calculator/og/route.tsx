import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { decodeAnswers } from "@/lib/permalink";
import { calculate } from "@/lib/calculator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const encoded = searchParams.get("s");
  const dark = searchParams.get("theme") === "dark";
  const story = searchParams.get("format") === "story";

  // Colours
  const bg    = dark ? "#1a1816" : "#F7F5F2";
  const fg    = dark ? "#F7F5F2" : "#1a1816";
  const muted = dark ? "#9b9993" : "#6b6b6b";
  const barBg = dark ? "#3a3835" : "#e4e4e0";

  // Dimensions
  const W = story ? 1080 : 1200;
  const H = story ? 1920 : 630;
  const barW = story ? 960 : 1080;
  const bigFont = story ? 220 : 160;
  const padding = story ? 80 : 60;

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
          backgroundColor: bg,
          padding: `${padding}px`,
          position: "relative",
        }}
      >
        <div style={{ fontSize: hasData ? bigFont : 72, color: fg, lineHeight: 1, fontFamily: "Georgia, serif" }}>
          {hasData ? `${percent}%` : "How Much Life Left?"}
        </div>
        {hasData && (
          <div style={{ fontSize: story ? 32 : 24, color: muted, marginTop: 12, letterSpacing: "0.08em", fontFamily: "system-ui, sans-serif" }}>
            LIFE COMPLETED
          </div>
        )}
        {hasData && (
          <div style={{ display: "flex", width: barW, height: story ? 14 : 10, marginTop: story ? 80 : 52, backgroundColor: barBg, borderRadius: 7 }}>
            <div style={{ width: `${percent}%`, height: "100%", backgroundColor: fg, borderRadius: 7 }} />
          </div>
        )}
        {hasData && (
          <div style={{ fontSize: story ? 34 : 26, color: muted, marginTop: story ? 60 : 44, fontFamily: "system-ui, sans-serif" }}>
            {`${expected} life expectancy · ${yearsLeft} years left`}
          </div>
        )}
        <div
          style={{
            fontSize: story ? 28 : 20,
            color: dark ? "#6b6b6b" : "#9b9b93",
            position: "absolute",
            bottom: story ? 80 : 44,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          macedo.app/life-calculator
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}
