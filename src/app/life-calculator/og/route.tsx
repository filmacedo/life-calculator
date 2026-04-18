import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { decodeAnswers } from "@/lib/permalink";
import { calculate } from "@/lib/calculator";

export const runtime = "edge";

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

  // Dot strip: one dot per year of expected life, capped at 90
  const totalDots = expected ? Math.min(expected, 90) : 80;
  const filledDots = percent !== null ? Math.round((percent / 100) * totalDots) : 0;
  // Size dots to fill ~1080px with 3px gaps
  const dotSize = Math.max(8, Math.floor((1080 - (totalDots - 1) * 3) / totalDots));

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
          fontFamily: "serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {percent !== null && yearsLeft !== null && expected !== null ? (
          <>
            {/* Big percentage + label */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 160,
                  color: "#1a1a1a",
                  lineHeight: 1,
                  fontFamily: "serif",
                }}
              >
                {percent}%
              </div>
              <div
                style={{
                  fontSize: 26,
                  color: "#6b6b6b",
                  marginTop: 10,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: "sans-serif",
                }}
              >
                life completed
              </div>
            </div>

            {/* Dot strip */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
                marginTop: 52,
              }}
            >
              {Array.from({ length: totalDots }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: dotSize,
                    height: dotSize,
                    borderRadius: "50%",
                    backgroundColor: i < filledDots ? "#1a1a1a" : "transparent",
                    border: i < filledDots ? "none" : `1.5px solid #c4c4bc`,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            {/* Stats line */}
            <div
              style={{
                fontSize: 26,
                color: "#6b6b6b",
                marginTop: 44,
                fontFamily: "sans-serif",
              }}
            >
              {expected} life expectancy · {yearsLeft} years left
            </div>
          </>
        ) : (
          /* Fallback — no share param */
          <div
            style={{
              fontSize: 72,
              color: "#1a1a1a",
              lineHeight: 1.2,
              textAlign: "center",
              maxWidth: 800,
              fontFamily: "serif",
            }}
          >
            How Much Life Left?
          </div>
        )}

        {/* URL */}
        <div
          style={{
            fontSize: 20,
            color: "#9b9b93",
            position: "absolute",
            bottom: 44,
            fontFamily: "sans-serif",
          }}
        >
          macedo.app/life-calculator
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
