"use client";

import { ShareButton } from "./ShareButton";

interface ShareBarProps {
  url: string;
  percentLived: number;
}

export function ShareBar({ url, percentLived }: ShareBarProps) {
  return (
    <div className="flex justify-center">
      <ShareButton url={url} percentLived={percentLived} />
    </div>
  );
}
