import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { AppHeader } from "@/widgets/app-header";
import { GameIntro } from "@/widgets/game-intro";
import { GameSetup } from "@/features/configure-game";
import { type GameMode, useGameSessionStore } from "@/entities/game-session";
import { type CategoryId } from "@/entities/question";

import { routes } from "@/shared/config";

export function HomePage() {
  const navigate = useNavigate();
  const startSession = useGameSessionStore((state) => state.startSession);
  const resetSession = useGameSessionStore((state) => state.resetSession);
  const [mode, setMode] = useState<GameMode>("solo");
  const [categoryId, setCategoryId] = useState<CategoryId>("all");

  useEffect(() => {
    resetSession();
  }, [resetSession]);

  const handleStart = () => {
    if (startSession({ categoryId, mode })) navigate(routes.game);
  };

  return (
    <div className="app-noise min-h-dvh">
      <AppHeader />
      <main className="safe-bottom mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="animate-rise grid items-start gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-7">
          <GameIntro />
          <GameSetup
            categoryId={categoryId}
            mode={mode}
            onCategoryChange={setCategoryId}
            onModeChange={setMode}
            onStart={handleStart}
          />
        </div>
      </main>
    </div>
  );
}
