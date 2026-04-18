"use client";

import { useState, useCallback, useEffect } from "react";

interface ShareModalProps {
  url: string;
  percentLived: number;
  onClose: () => void;
}

type Format = "feed" | "story";
type Theme  = "light" | "dark";

export function ShareModal({ url, percentLived, onClose }: ShareModalProps) {
  const [format, setFormat]       = useState<Format>("feed");
  const [theme, setTheme]         = useState<Theme>("light");
  const [copied, setCopied]       = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imgError, setImgError]   = useState(false);
  const [igBusy, setIgBusy]       = useState(false);
  const [igHint, setIgHint]       = useState<string | null>(null);

  const encoded = (() => {
    try { return new URL(url).searchParams.get("s"); } catch { return null; }
  })();

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const ogImageUrl = (() => {
    const base = encoded
      ? `${origin}/life-calculator/og?s=${encoded}`
      : `${origin}/life-calculator/og`;
    return `${base}&theme=${theme}&format=${format}`;
  })();

  // Reset image error when options change
  useEffect(() => { setImgError(false); }, [theme, format]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleCopy = useCallback(async () => {
    const text = `I'm ${percentLived}% through my life. Find out yours: ${url}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url, percentLived]);

  const handleInstagramShare = useCallback(async () => {
    setIgBusy(true);
    setIgHint(null);
    try {
      const res = await fetch(ogImageUrl);
      const blob = await res.blob();
      const file = new File([blob], `life-calculator-story-${theme}.png`, { type: "image/png" });

      // Web Share API with file — mobile native share sheet (Instagram will appear)
      const canShareFile =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFile) {
        try {
          await navigator.share({ files: [file] });
          return;
        } catch (err) {
          // User cancelled or share errored — fall through to download
          if (err instanceof DOMException && err.name === "AbortError") return;
        }
      }

      // Desktop fallback: download the image and show instructions
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(a.href);
      setIgHint("Image saved — upload it to your Instagram story.");
      setTimeout(() => setIgHint(null), 4500);
    } finally {
      setIgBusy(false);
    }
  }, [ogImageUrl, theme]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch(ogImageUrl);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `life-calculator-${format}-${theme}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setDownloading(false);
    }
  }, [ogImageUrl, format, theme]);

  const tweetText = encodeURIComponent(`I'm ${percentLived}% through my life. Find out yours:`);
  const tweetHref = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(url)}`;

  const aspectClass = format === "story" ? "aspect-[9/16]" : "aspect-[1200/630]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <p className="font-medium">Share your results</p>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Toggles */}
        <div className="px-6 pb-4 flex gap-3">
          {/* Format toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden text-sm flex-1">
            {(["feed", "story"] as Format[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex-1 py-2 capitalize transition-colors ${
                  format === f
                    ? "bg-foreground text-background"
                    : "hover:bg-foreground/5"
                }`}
              >
                {f === "feed" ? "Feed 1.91:1" : "Story 9:16"}
              </button>
            ))}
          </div>
          {/* Theme toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden text-sm">
            {(["light", "dark"] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 capitalize transition-colors ${
                  theme === t
                    ? "bg-foreground text-background"
                    : "hover:bg-foreground/5"
                }`}
              >
                {t === "light" ? "☀︎" : "☽"}
              </button>
            ))}
          </div>
        </div>

        {/* Image preview */}
        <div className="px-6">
          {imgError ? (
            <div className={`w-full ${aspectClass} rounded-xl border border-border bg-muted/20 flex items-center justify-center text-sm text-muted`}>
              Preview unavailable
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={ogImageUrl}
              src={ogImageUrl}
              alt="Your life calculator result"
              className={`w-full rounded-xl border border-border object-cover ${aspectClass}`}
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          {/* X / Twitter — feed only */}
          {format === "feed" && (
            <a
              href={tweetHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>
          )}

          {/* Instagram — story only */}
          {format === "story" && (
            <>
              <button
                onClick={handleInstagramShare}
                disabled={igBusy}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                {igBusy ? "Preparing…" : "Share to Instagram"}
              </button>
              {igHint && (
                <p className="text-xs text-muted text-center -mt-1">{igHint}</p>
              )}
            </>
          )}

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border rounded-lg text-sm hover:bg-foreground hover:text-background transition-colors"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border rounded-lg text-sm hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
          >
            {downloading ? "Downloading…" : `Download image`}
          </button>
        </div>
      </div>
    </div>
  );
}
