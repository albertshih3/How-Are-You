"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
}

export function SafeHtmlRenderer({ html, className = "" }: SafeHtmlRendererProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    // Only run DOMPurify on the client side
    if (typeof window !== "undefined") {
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "ul", "ol", "li"],
        ALLOWED_ATTR: [],
      });
      setSanitizedHtml(sanitized);
    }
  }, [html]);

  // If no HTML tags detected, it's likely plain text - render as-is wrapped in <p>
  if (!html.includes("<") && !html.includes(">")) {
    return (
      <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
        <p>{html}</p>
      </div>
    );
  }

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
