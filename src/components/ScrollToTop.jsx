import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10); 
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}