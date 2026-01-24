import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export default function ScrollToHash() {
  const { location } = useRouterState();

  useEffect(() => {
    // Scroll to hash if present
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Otherwise scroll to top on route change
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
}
