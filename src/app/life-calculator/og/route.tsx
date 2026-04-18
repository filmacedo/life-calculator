import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { decodeAnswers } from "@/lib/permalink";
import { calculate } from "@/lib/calculator";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const encoded = searchParams.get("s");

  let percent = null;
  let yearsLeft = null;

  if (encoded) {
    const answers = decodeAnswers(encoded);
    if (answers) {
      const result = calculate(answers, true);
      percent = result.percentLived;
      yearsLeft = Math.round(result.yearsLeft);
    }
  }

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
        }}
      >
        {percent !== null ? (
          <>
            <div
              style={{
                fontSize: 180,
                color: "#1a1a1a",
                lineHeight: 1,
              }}
            >
              {percent}%
            </div>
            <div
              style={{
                fontSize: 32,
                color: "#6b6b6b",
                marginTop: 20,
              }}
            >
              ~{yearsLeft} years ahead
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: 72,
                color: "#1a1a1a",
                lineHeight: 1.2,
                textAlign: "center",
                maxWidth: 800,
              }}
            >
              How Much Life Left?
            </div>
          </>
        )}
        <div
          style={{
            fontSize: 20,
            color: "#6b6b6b",
            position: "absolute",
            bottom: 40,
          }}
        >
          macedo.app/life-calculator
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
