import { useState, useEffect } from "react";

/**
 * A custom hook that tracks the window's vertical scroll position.
 * It's throttled for performance to avoid excessive re-renders.
 *
 * @returns {number} The current vertical scroll position (window.scrollY).
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollPosition(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
}
