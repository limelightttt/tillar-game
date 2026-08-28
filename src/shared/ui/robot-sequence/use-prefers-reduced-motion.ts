import { useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function getReducedMotionPreference() {
  return typeof window !== "undefined" && window.matchMedia(reducedMotionQuery).matches;
}

function getServerReducedMotionPreference() {
  return false;
}

function subscribeToReducedMotion(onPreferenceChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onPreferenceChange);

  return () => mediaQuery.removeEventListener("change", onPreferenceChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    getServerReducedMotionPreference,
  );
}
