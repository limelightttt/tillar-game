import { Navigate, useNavigate } from "react-router-dom";

import { GameResultView } from "@/widgets/game-result";
import { useGameSessionStore } from "@/entities/game-session";
import { CategoryIcon, questionCategories } from "@/entities/question";

import { routes, useI18n } from "@/shared/config";

export function ResultPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
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
      ? t("result.picture.emptyTitle")
      : accuracy >= 0.7
        ? t("result.picture.goodTitle")
        : t("result.picture.startTitle")
    : playerWon
      ? t("result.picture.winTitle")
      : draw
        ? t("result.picture.drawTitle")
        : t("result.picture.loseTitle");
  const subtitle = isSolo
    ? playerStats.answered === 0
      ? t("result.picture.emptyText")
      : t("result.picture.soloText")
    : finishReason === "out-of-lives"
      ? t("result.picture.livesText")
      : t("result.picture.roundsText");
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
      categoryIcon={<CategoryIcon categoryId={category?.id ?? "all"} />}
      categoryLabel={t(`category.${category?.id ?? "all"}`)}
      gameLabel={t("product.two.header")}
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
