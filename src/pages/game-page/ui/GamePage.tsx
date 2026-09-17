import { useEffect, useState } from "react";

import { LogOut } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import { GameScoreboard } from "@/widgets/game-scoreboard";
import { QuestionBoard } from "@/widgets/question-board";
import { FeedbackModal } from "@/features/continue-game";
import { ExitGameModal } from "@/features/exit-game";
import { useGameSessionStore } from "@/entities/game-session";

import { routes, useI18n } from "@/shared/config";
import { Button } from "@/shared/ui";

const CLOCK_REFRESH_MS = 100;
const ROUND_RESULT_HOLD_MS = 1_450;

export function GamePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const mode = useGameSessionStore((state) => state.mode);
  const status = useGameSessionStore((state) => state.status);
  const currentQuestion = useGameSessionStore((state) => state.currentQuestion);
  const currentRound = useGameSessionStore((state) => state.currentRound);
  const playerLives = useGameSessionStore((state) => state.playerLives);
  const botLives = useGameSessionStore((state) => state.botLives);
  const playerStats = useGameSessionStore((state) => state.playerStats);
  const botStats = useGameSessionStore((state) => state.botStats);
  const playerAnswer = useGameSessionStore((state) => state.playerAnswer);
  const botAnswer = useGameSessionStore((state) => state.botAnswer);
  const feedback = useGameSessionStore((state) => state.feedback);
  const elapsedResponseTimeMs = useGameSessionStore((state) => state.elapsedResponseTimeMs);
  const answerCurrentQuestion = useGameSessionStore((state) => state.answerCurrentQuestion);
  const advance = useGameSessionStore((state) => state.advance);
  const tick = useGameSessionStore((state) => state.tick);
  const finishSolo = useGameSessionStore((state) => state.finishSolo);
  const resetSession = useGameSessionStore((state) => state.resetSession);

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
      navigate(routes.result, { replace: true });
    }
  }, [navigate, status]);

  if (status === "idle" || !currentQuestion) {
    return <Navigate replace to={routes.home} />;
  }

  const handleExit = () => {
    if (mode === "solo") {
      finishSolo();
      navigate(routes.result, { replace: true });
      return;
    }

    resetSession();
    navigate(routes.home, { replace: true });
  };

  return (
    <div className="app-noise min-h-dvh">
      <main className="safe-bottom mx-auto w-full max-w-5xl px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className="mb-3 flex justify-end">
          <Button
            className="rounded-full px-4 text-muted hover:border-primary/25 hover:bg-primary-soft hover:text-primary"
            variant="secondary"
            onClick={() => setExitDialogOpen(true)}
          >
            <LogOut aria-hidden="true" className="size-4" />
            {t("header.finish")}
          </Button>
        </div>
        <div className="mb-3 sm:mb-4">
          <GameScoreboard
            botLives={botLives}
            botStats={botStats}
            currentRound={currentRound}
            mode={mode}
            playerLives={playerLives}
            playerStats={playerStats}
          />
        </div>
        <QuestionBoard
          botAnswer={botAnswer}
          elapsedResponseTimeMs={elapsedResponseTimeMs}
          mode={mode}
          playerAnswer={playerAnswer}
          question={currentQuestion}
          status={status}
          onAnswer={answerCurrentQuestion}
        />
      </main>

      <FeedbackModal
        answer={playerAnswer}
        feedback={feedback}
        open={status === "feedback"}
        question={currentQuestion}
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
