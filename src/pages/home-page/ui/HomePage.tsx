import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { AppHeader } from "@/widgets/app-header";
import { GameIntro } from "@/widgets/game-intro";
import { GameSetup } from "@/features/configure-game";
import { GameProductSelector } from "@/features/select-game";
import { type GameProductId } from "@/entities/game-product";
import { type GameMode, useGameSessionStore } from "@/entities/game-session";
import { type CategoryId } from "@/entities/question";
import { useWordGameSessionStore } from "@/entities/word-game-session";

import { routes } from "@/shared/config";

export function HomePage() {
  const navigate = useNavigate();
  const startPictureSession = useGameSessionStore((state) => state.startSession);
  const resetPictureSession = useGameSessionStore((state) => state.resetSession);
  const startWordSession = useWordGameSessionStore((state) => state.startSession);
  const resetWordSession = useWordGameSessionStore((state) => state.resetSession);
  const [gameId, setGameId] = useState<GameProductId>("two-pictures");
  const [mode, setMode] = useState<GameMode>("solo");
  const [categoryId, setCategoryId] = useState<CategoryId>("all");

  useEffect(() => {
    // Browser Back may return here without using the in-game exit button.
    // A home mount is a new product choice, so no previous in-memory round remains resumable.
    resetPictureSession();
    resetWordSession();
  }, [resetPictureSession, resetWordSession]);

  const handleStart = () => {
    if (gameId === "four-pictures-word") {
      resetPictureSession();
      const started = startWordSession({ categoryId, mode });
      if (started) navigate(routes.wordGame);
      return;
    }

    resetWordSession();
    const started = startPictureSession({ categoryId, mode });
    if (started) navigate(routes.game);
  };

  return (
    <div className="app-noise min-h-dvh">
      <AppHeader />
      <main className="safe-bottom mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <GameProductSelector value={gameId} onChange={setGameId} />
        <div className="animate-rise grid items-start gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-7">
          <GameIntro gameId={gameId} />
          <GameSetup
            categoryId={categoryId}
            gameId={gameId}
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
