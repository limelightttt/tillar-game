import { Navigate, useNavigate } from "react-router-dom";

import { GameResultView } from "@/widgets/game-result";
import { CategoryIcon, questionCategories } from "@/entities/question";
import { useWordGameSessionStore } from "@/entities/word-game-session";

import { routes } from "@/shared/config";

export function WordResultPage() {
  const navigate = useNavigate();
  const status = useWordGameSessionStore((state) => state.status);
  const mode = useWordGameSessionStore((state) => state.mode);
  const categoryId = useWordGameSessionStore((state) => state.selectedCategoryId);
  const playerStats = useWordGameSessionStore((state) => state.playerStats);
  const botStats = useWordGameSessionStore((state) => state.botStats);
  const duelResult = useWordGameSessionStore((state) => state.duelResult);
  const finishReason = useWordGameSessionStore((state) => state.finishReason);
  const startSession = useWordGameSessionStore((state) => state.startSession);
  const resetSession = useWordGameSessionStore((state) => state.resetSession);

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
      ? "До следующей загадки!"
      : accuracy >= 0.7
        ? "Слова тебе покоряются!"
        : "Отличная тренировка!"
    : playerWon
      ? "Словесная победа!"
      : draw
        ? "Редкая ничья"
        : "Возьмём реванш?";
  const subtitle = isSolo
    ? playerStats.answered === 0
      ? "Начни новую сессию, когда будешь готов искать связи между подсказками."
      : "Каждая разгадка тренирует ассоциации, внимание и словарный запас."
    : finishReason === "out-of-lives"
      ? "Матч завершился досрочно: один из игроков потерял все три жизни."
      : "Восемь раундов завершены — счёт определён по верным словам и времени.";
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
    if (startSession({ categoryId, mode })) navigate(routes.wordGame);
  };

  const goHome = () => {
    resetSession();
    navigate(routes.home);
  };

  return (
    <GameResultView
      botStats={botStats}
      categoryIcon={<CategoryIcon categoryId={category?.id ?? "all"} />}
      categoryLabel={category?.label ?? "Все темы"}
      gameLabel="Четыре картинки / слово"
      isSolo={isSolo}
      playerStats={playerStats}
      robotVariant={tone === "success" ? "celebrate" : tone === "danger" ? "encourage" : "idle"}
      statusLabel={isSolo ? "Сессия завершена" : "Результат дуэли"}
      subtitle={subtitle}
      title={title}
      tone={tone}
      onGoHome={goHome}
      onPlayAgain={playAgain}
    />
  );
}
