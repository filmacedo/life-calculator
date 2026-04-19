import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { decodeAnswers } from "@/lib/permalink";
import { calculate } from "@/lib/calculator";

// Load Instrument Sans (400 + 600) and Instrument Serif (400) from Google Fonts.
// Matches the typography system used on the site.
// Cached at module scope — fetched once per cold start.
let fontsPromise: Promise<{
  sansRegular: ArrayBuffer | null;
  sansSemibold: ArrayBuffer | null;
  instrumentSerif: ArrayBuffer | null;
}> | null = null;

async function fetchGoogleFont(cssUrl: string): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(cssUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    const css = await cssRes.text();
    const match = css.match(/src:\s*url\((https:[^)]+)\)\s*format\('(?:truetype|opentype)'\)/);
    if (!match) return null;
    const fontRes = await fetch(match[1]);
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

async function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = (async () => {
      const [sansRegular, sansSemibold, instrumentSerif] = await Promise.all([
        fetchGoogleFont("https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400&display=swap"),
        fetchGoogleFont("https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600&display=swap"),
        fetchGoogleFont("https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap"),
      ]);
      return { sansRegular, sansSemibold, instrumentSerif };
    })();
  }
  return fontsPromise;
}

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
  const bigFont = story ? 280 : 200;
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

  const { sansRegular, sansSemibold, instrumentSerif } = await loadFonts();
  const fontList: Array<{ name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" }> = [];
  if (sansRegular) fontList.push({ name: "Instrument Sans", data: sansRegular, weight: 400, style: "normal" });
  if (sansSemibold) fontList.push({ name: "Instrument Sans", data: sansSemibold, weight: 600, style: "normal" });
  if (instrumentSerif) fontList.push({ name: "Instrument Serif", data: instrumentSerif, weight: 400, style: "normal" });
  const fonts = fontList.length ? fontList : undefined;

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
        {hasData && (
          <div style={{ fontSize: story ? 32 : 24, color: fg, marginBottom: story ? 28 : 18, letterSpacing: "0.12em", fontFamily: "Instrument Sans, system-ui, sans-serif", fontWeight: 600 }}>
            LIFE COMPLETED
          </div>
        )}
        <div style={{ fontSize: hasData ? bigFont : 96, color: fg, lineHeight: 1, fontFamily: "Instrument Serif, Georgia, serif" }}>
          {hasData ? `${percent}%` : "How Much Life Left?"}
        </div>
        {!hasData && (
          <div
            style={{
              marginTop: story ? 56 : 36,
              fontSize: story ? 36 : 28,
              color: muted,
              fontFamily: "Instrument Sans, system-ui, sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            Calculate yours in 30 seconds →
          </div>
        )}
        {hasData && (
          <div style={{ display: "flex", width: barW, height: story ? 14 : 10, marginTop: story ? 80 : 52, backgroundColor: barBg, borderRadius: 7 }}>
            <div style={{ width: `${percent}%`, height: "100%", backgroundColor: fg, borderRadius: 7 }} />
          </div>
        )}
        {hasData && (
          <div style={{ fontSize: story ? 34 : 26, color: muted, marginTop: story ? 60 : 44, fontFamily: "Instrument Sans, system-ui, sans-serif" }}>
            {`${expected}y life expectancy · ${yearsLeft} years left`}
          </div>
        )}
        <div
          style={{
            fontSize: story ? 28 : 20,
            color: dark ? "#6b6b6b" : "#9b9b93",
            position: "absolute",
            bottom: story ? 80 : 44,
            fontFamily: "Instrument Sans, system-ui, sans-serif",
          }}
        >
          macedo.app/life-calculator
        </div>
      </div>
    ),
    { width: W, height: H, fonts }
  );
}
