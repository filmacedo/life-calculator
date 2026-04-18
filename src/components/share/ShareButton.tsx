"use client";

import { useState, useCallback } from "react";
import { shareResults } from "@/lib/share";

interface ShareButtonProps {
  url: string;
  percentLived: number;
  className?: string;
}

export function ShareButton({ url, percentLived, className }: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared" | "failed">(
    "idle"
  );

  const handleShare = useCallback(async () => {
    const result = await shareResults(url, percentLived);
    setStatus(result);
    if (result === "copied") {
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [url, percentLived]);

  return (
    <button
      onClick={handleShare}
      className={className ?? "px-6 py-3 border border-foreground rounded-lg text-sm hover:bg-foreground hover:text-background transition-colors"}
    >
      {status === "copied"
        ? "Link copied!"
        : status === "shared"
          ? "Shared!"
          : "Share your results"}
    </button>
  );
}
