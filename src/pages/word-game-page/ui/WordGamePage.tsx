import { useEffect, useState } from "react";

import { Swords, UserRound } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import { AppHeader } from "@/widgets/app-header";
import { GameScoreboard } from "@/widgets/game-scoreboard";
import { WordPuzzleBoard } from "@/widgets/word-puzzle-board";
import { WordFeedbackModal } from "@/features/continue-word-game";
import { ExitGameModal } from "@/features/exit-game";
import {
  useWordGameSessionStore,
  WORD_DUEL_ROUND_COUNT,
  WORD_DUEL_STARTING_LIVES,
} from "@/entities/word-game-session";

import { routes } from "@/shared/config";

const CLOCK_REFRESH_MS = 100;
const ROUND_RESULT_HOLD_MS = 1_450;

export function WordGamePage() {
  const navigate = useNavigate();
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const mode = useWordGameSessionStore((state) => state.mode);
  const status = useWordGameSessionStore((state) => state.status);
  const currentPuzzle = useWordGameSessionStore((state) => state.currentPuzzle);
  const currentRound = useWordGameSessionStore((state) => state.currentRound);
  const letterTiles = useWordGameSessionStore((state) => state.letterTiles);
  const selectedTileIds = useWordGameSessionStore((state) => state.selectedTileIds);
  const playerLives = useWordGameSessionStore((state) => state.playerLives);
  const botLives = useWordGameSessionStore((state) => state.botLives);
  const playerStats = useWordGameSessionStore((state) => state.playerStats);
  const botStats = useWordGameSessionStore((state) => state.botStats);
  const playerAnswer = useWordGameSessionStore((state) => state.playerAnswer);
  const botAnswer = useWordGameSessionStore((state) => state.botAnswer);
  const feedback = useWordGameSessionStore((state) => state.feedback);
  const elapsedResponseTimeMs = useWordGameSessionStore((state) => state.elapsedResponseTimeMs);
  const selectTile = useWordGameSessionStore((state) => state.selectTile);
  const removeTile = useWordGameSessionStore((state) => state.removeTile);
  const clearSelection = useWordGameSessionStore((state) => state.clearSelection);
  const submitAnswer = useWordGameSessionStore((state) => state.submitAnswer);
  const advance = useWordGameSessionStore((state) => state.advance);
  const tick = useWordGameSessionStore((state) => state.tick);
  const finishSolo = useWordGameSessionStore((state) => state.finishSolo);
  const resetSession = useWordGameSessionStore((state) => state.resetSession);

  useEffect(() => {
    if (status !== "playing") return undefined;

    tick();
    const interval = window.setInterval(tick, CLOCK_REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [status, tick]);

  useEffect(() => {
    if (status !== "round-result") return undefined;

    const timeout = window.setTimeout(() => advance(), ROUND_RESULT_HOLD_MS);
    return () => window.clearTimeout(timeout);
  }, [advance, status]);

  useEffect(() => {
    if (status === "finished") {
      navigate(routes.wordResult, { replace: true });
    }
  }, [navigate, status]);

  if (status === "idle" || !currentPuzzle) {
    return <Navigate replace to={routes.home} />;
  }

  const handleExit = () => {
    if (mode === "solo") {
      finishSolo();
      navigate(routes.wordResult, { replace: true });
      return;
    }

    resetSession();
    navigate(routes.home, { replace: true });
  };

  const modeLabel = mode === "solo" ? "Одиночная игра" : "Дуэль с ботом";
  const ModeIcon = mode === "solo" ? UserRound : Swords;

  return (
    <div className="app-noise min-h-dvh">
      <AppHeader
        backLabel="Завершить игру"
        eyebrow="4 картинки / слово"
        rightSlot={
          <span
            aria-label={modeLabel}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-3 text-xs font-black text-muted shadow-sm"
          >
            <ModeIcon aria-hidden="true" className="size-4 text-primary" />
            <span className="hidden sm:inline">{modeLabel}</span>
          </span>
        }
        title={mode === "solo" ? `Слово ${playerStats.answered + 1}` : `Раунд ${currentRound}`}
        onBack={() => setExitDialogOpen(true)}
      />

      <main className="safe-bottom mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-3 sm:mb-4">
          <GameScoreboard
            botLives={botLives}
            botStats={botStats}
            currentRound={currentRound}
            mode={mode}
            playerLives={playerLives}
            playerStats={playerStats}
            roundCount={WORD_DUEL_ROUND_COUNT}
            startingLives={WORD_DUEL_STARTING_LIVES}
          />
        </div>
        <WordPuzzleBoard
          botAnswer={botAnswer}
          elapsedResponseTimeMs={elapsedResponseTimeMs}
          letterTiles={letterTiles}
          mode={mode}
          playerAnswer={playerAnswer}
          puzzle={currentPuzzle}
          selectedTileIds={selectedTileIds}
          status={status}
          onClear={clearSelection}
          onRemoveTile={removeTile}
          onSelectTile={selectTile}
          onSubmit={submitAnswer}
        />
      </main>

      <WordFeedbackModal
        answer={playerAnswer}
        feedback={feedback}
        open={status === "feedback"}
        puzzle={currentPuzzle}
        onContinue={() => advance()}
      />
      <ExitGameModal
        mode={mode}
        open={exitDialogOpen}
        onCancel={() => setExitDialogOpen(false)}
        onConfirm={handleExit}
      />
    </div>
  );
}
