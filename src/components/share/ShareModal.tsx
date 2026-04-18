"use client";

import { useState, useCallback, useEffect } from "react";

interface ShareModalProps {
  url: string;
  percentLived: number;
  onClose: () => void;
}

export function ShareModal({ url, percentLived, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Extract the encoded param from the share URL to build OG image URL
  const encoded = (() => {
    try {
      return new URL(url).searchParams.get("s");
    } catch {
      return null;
    }
  })();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const ogImageUrl = encoded
    ? `${origin}/life-calculator/og?s=${encoded}`
    : `${origin}/life-calculator/og`;

  const [imgError, setImgError] = useState(false);

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
      // fallback
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

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch(ogImageUrl);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "life-calculator.png";
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setDownloading(false);
    }
  }, [ogImageUrl]);

  const tweetText = encodeURIComponent(`I'm ${percentLived}% through my life. Find out yours:`);
  const tweetUrl = encodeURIComponent(url);
  const tweetHref = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-background rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
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

        {/* OG image preview */}
        <div className="px-6">
          {imgError ? (
            <div className="w-full aspect-[1200/630] rounded-xl border border-border bg-muted/20 flex items-center justify-center text-sm text-muted">
              Preview unavailable
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ogImageUrl}
              alt="Your life calculator result"
              className="w-full rounded-xl border border-border"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          {/* X / Twitter */}
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

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border rounded-lg text-sm hover:bg-foreground hover:text-background transition-colors"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>

          {/* Download for Instagram */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border rounded-lg text-sm hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
          >
            {downloading ? "Downloading…" : "Download image"}
          </button>
        </div>
      </div>
    </div>
  );
}
