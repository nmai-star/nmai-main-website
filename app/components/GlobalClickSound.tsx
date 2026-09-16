"use client";

import { useEffect } from "react";
import { playClickSound, preloadClickSound } from "../utils/sound";

/**
 * Global component that guarantees click sounds for all buttons, links,
 * tabs, and interactive elements across all pages of NMAI.
 */
export default function GlobalClickSound() {
  useEffect(() => {
    // Preload audio assets immediately
    preloadClickSound();

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect any button, link, interactive card, or role="button" element
      const interactiveEl = target.closest(
        "button, a, input[type='button'], input[type='submit'], [role='button'], [role='tab'], summary"
      );

      if (interactiveEl) {
        playClickSound();
      }
    };

    // Attach to window on capture phase so clicks are handled regardless of stopPropagation
    window.addEventListener("click", handleGlobalClick, { capture: true });

    return () => {
      window.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  return null;
}
