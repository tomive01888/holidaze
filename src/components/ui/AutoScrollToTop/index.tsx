import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls the window to the top whenever the route changes.
 *
 * This is useful for single-page applications where navigating to a new route
 * does not trigger a full page reload, ensuring the user always starts at
 * the top of the page.
 *
 * @component
 * @returns {null} This component does not render any visible UI.
 */
export default function AutoScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
