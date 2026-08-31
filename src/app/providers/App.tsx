import { useEffect } from "react";

import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "@/app/router/AppRouter";

import { preloadRobotActions } from "@/shared/ui/robot-sequence";

export function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const preparationFrame = window.requestAnimationFrame(() => {
      void preloadRobotActions();
    });

    return () => window.cancelAnimationFrame(preparationFrame);
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
