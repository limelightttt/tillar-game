import { Navigate, useNavigate } from "react-router-dom";

import { GameResultView } from "@/widgets/game-result";
import { useGameSessionStore } from "@/entities/game-session";
import { questionCategories } from "@/entities/question";

import { routes } from "@/shared/config";

export function ResultPage() {
  const navigate = useNavigate();
  const status = useGameSessionStore((state) => state.status);
  const mode = useGameSessionStore((state) => state.mode);
  const categoryId = useGameSessionStore((state) => state.selectedCategoryId);
  const playerStats = useGameSessionStore((state) => state.playerStats);
  const botStats = useGameSessionStore((state) => state.botStats);
  const duelResult = useGameSessionStore((state) => state.duelResult);
  const finishReason = useGameSessionStore((state) => state.finishReason);
  const startSession = useGameSessionStore((state) => state.startSession);
  const resetSession = useGameSessionStore((state) => state.resetSession);

  if (status !== "finished") {
    return <Navigate replace to={routes.home} />;
  }

  const isSolo = mode === "solo";
  const playerWon = duelResult?.winner === "player";
  const draw = duelResult?.winner === "draw";
  const accuracy = playerStats.answered > 0 ? playerStats.correct / playerStats.answered : 0;
  const category = questionCategories.find((item) => item.id === categoryId);
  const title = isSolo
    ? playerStats.answered === 0
      ? "До следующей попытки!"
      : accuracy >= 0.7
        ? "Отличная разминка!"
        : "Хорошее начало!"
    : playerWon
      ? "Победа!"
      : draw
        ? "Идеальная ничья"
        : "Реванш?";
  const subtitle = isSolo
    ? playerStats.answered === 0
      ? "Возвращайся, когда будешь готов продолжить игру."
      : "Каждый ответ добавил ещё один факт в твою копилку знаний."
    : finishReason === "out-of-lives"
      ? "Матч завершился досрочно: один из игроков потерял все жизни."
      : "Восемь раундов позади — результат определён по ответам и времени.";
  const tone = isSolo
    ? playerStats.answered === 0
      ? "neutral"
      : accuracy >= 0.7
        ? "success"
        : "neutral"
    : playerWon
      ? "success"
      : draw
        ? "neutral"
        : "danger";

  const playAgain = () => {
    if (startSession({ categoryId, mode })) navigate(routes.game);
  };

  const goHome = () => {
    resetSession();
    navigate(routes.home);
  };

  return (
    <GameResultView
      botStats={botStats}
      categoryIcon={category?.icon}
      categoryLabel={category?.label ?? "Все темы"}
      gameLabel="Игра 01 · Две картинки"
      isSolo={isSolo}
      playerStats={playerStats}
      robotVariant={tone === "success" ? "jump" : tone === "danger" ? "squat" : "idle"}
      statusLabel={isSolo ? "Сессия завершена" : "Результат дуэли"}
      subtitle={subtitle}
      title={title}
      tone={tone}
      onGoHome={goHome}
      onPlayAgain={playAgain}
    />
  );
}
