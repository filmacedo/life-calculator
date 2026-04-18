"use client";

import { useState } from "react";
import { ShareModal } from "./ShareModal";

interface ShareButtonProps {
  url: string;
  percentLived: number;
  className?: string;
}

export function ShareButton({ url, percentLived, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ?? "px-6 py-3 border border-foreground rounded-lg text-sm hover:bg-foreground hover:text-background transition-colors"}
      >
        Share your results
      </button>

      {open && (
        <ShareModal
          url={url}
          percentLived={percentLived}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
