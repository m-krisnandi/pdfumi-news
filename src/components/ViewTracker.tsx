"use client";

import { useEffect } from "react";

export function ViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    if (!articleId) return;
    try {
      // Exclude automated bots/webdriver on client side
      if (typeof navigator !== "undefined" && navigator.webdriver) {
        return;
      }

      const storageKey = `pdfumi_viewed_${articleId}`;
      if (sessionStorage.getItem(storageKey)) {
        return; // Already counted for this session
      }
      sessionStorage.setItem(storageKey, "1");

      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: articleId }),
      }).catch(() => {
        // Silently catch background network error
      });
    } catch {
      // In private browsing without sessionStorage
    }
  }, [articleId]);

  return null;
}
