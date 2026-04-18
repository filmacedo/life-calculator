function fallbackCopyToClipboard(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    return true;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export async function shareResults(
  url: string,
  percentLived: number
): Promise<"copied" | "shared" | "failed"> {
  const text = `I'm ~${percentLived}% through my life. Find out yours:`;
  const fullText = `${text} ${url}`;

  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: "Life Calculator", text, url });
      return "shared";
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(fullText);
        return "copied";
      } catch {
        // clipboard API failed (permissions), try fallback
      }
    }

    if (fallbackCopyToClipboard(fullText)) {
      return "copied";
    }

    return "failed";
  } catch {
    return "failed";
  }
}
