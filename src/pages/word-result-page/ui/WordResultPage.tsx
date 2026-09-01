import { Navigate, useNavigate } from "react-router-dom";

import { GameResultView } from "@/widgets/game-result";
import { CategoryIcon, questionCategories } from "@/entities/question";
import { useWordGameSessionStore } from "@/entities/word-game-session";

import { routes, useI18n } from "@/shared/config";

export function WordResultPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
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
      ? t("result.word.emptyTitle")
      : accuracy >= 0.7
        ? t("result.word.goodTitle")
        : t("result.word.startTitle")
    : playerWon
      ? t("result.word.winTitle")
      : draw
        ? t("result.word.drawTitle")
        : t("result.word.loseTitle");
  const subtitle = isSolo
    ? playerStats.answered === 0
      ? t("result.word.emptyText")
      : t("result.word.soloText")
    : finishReason === "out-of-lives"
      ? t("result.word.livesText")
      : t("result.word.roundsText");
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
      categoryLabel={t(`category.${category?.id ?? "all"}`)}
      gameLabel={t("product.word.header")}
      isSolo={isSolo}
      playerStats={playerStats}
      robotVariant={tone === "success" ? "celebrate" : tone === "danger" ? "encourage" : "idle"}
      statusLabel={t(isSolo ? "result.sessionFinished" : "result.duelFinished")}
      subtitle={subtitle}
      title={title}
      tone={tone}
      onGoHome={goHome}
      onPlayAgain={playAgain}
    />
  );
}
