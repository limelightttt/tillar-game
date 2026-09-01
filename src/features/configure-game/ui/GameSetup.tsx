import { Check, Sparkles, UserRound, UsersRound } from "lucide-react";

import { type GameProductId } from "@/entities/game-product";
import { type GameMode } from "@/entities/game-session";
import {
  CategoryIcon,
  type CategoryId,
  filterQuestionsByCategory,
  pictureQuestions,
  questionCategories,
} from "@/entities/question";
import { filterWordPuzzlesByCategory, wordPuzzles } from "@/entities/word-puzzle";

import { type TranslationKey, useI18n } from "@/shared/config";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

interface GameSetupProps {
  categoryId: CategoryId;
  gameId: GameProductId;
  mode: GameMode;
  onCategoryChange: (categoryId: CategoryId) => void;
  onModeChange: (mode: GameMode) => void;
  onStart: () => void;
}

const modes = [
  {
    id: "solo",
    titleKey: "setup.solo.title",
    descriptionKey: "setup.solo.description",
    icon: UserRound,
    badgeKey: "setup.solo.badge",
  },
  {
    id: "duel-demo",
    titleKey: "setup.duel.title",
    descriptionKey: "setup.duel.description",
    icon: UsersRound,
    badgeKey: "setup.duel.badge",
  },
] as const satisfies readonly {
  badgeKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: typeof UserRound;
  id: GameMode;
  titleKey: TranslationKey;
}[];

export function GameSetup({
  categoryId,
  gameId,
  mode,
  onCategoryChange,
  onModeChange,
  onStart,
}: GameSetupProps) {
  const { t } = useI18n();
  const getContentCount = (targetCategoryId: CategoryId) =>
    gameId === "two-pictures"
      ? filterQuestionsByCategory(pictureQuestions, targetCategoryId).length
      : filterWordPuzzlesByCategory(wordPuzzles, targetCategoryId).length;
  const availableQuestions = getContentCount(categoryId);

  return (
    <section
      aria-labelledby="game-setup-title"
      className="tillar-surface rounded-[2rem] border p-5 backdrop-blur sm:p-7"
      id="game-setup"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
            {t("setup.eyebrow")}
          </p>
          <h2
            className="text-2xl font-black tracking-[-0.045em] text-foreground"
            id="game-setup-title"
          >
            {t("setup.title")}
          </h2>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Sparkles aria-hidden="true" className="size-5" />
        </span>
      </div>

      <div aria-label={t("setup.modeGroup")} className="grid gap-3" role="group">
        {modes.map((item) => {
          const Icon = item.icon;
          const selected = mode === item.id;

          return (
            <button
              aria-pressed={selected}
              className={cn(
                "group relative flex min-h-[5.5rem] items-center gap-4 rounded-[1.4rem] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                selected
                  ? "border-primary bg-primary-soft shadow-[0_10px_26px_-18px_rgba(8,124,240,0.65)]"
                  : "border-line bg-white hover:border-primary/35 hover:bg-soft/60",
              )}
              key={item.id}
              type="button"
              onClick={() => onModeChange(item.id)}
            >
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-2xl transition",
                  selected
                    ? "bg-primary text-white"
                    : "bg-soft text-muted group-hover:text-primary",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-black tracking-[-0.02em] text-foreground">
                    {t(item.titleKey)}
                  </span>
                  <span className="rounded-full bg-white px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.08em] text-muted">
                    {t(item.badgeKey)}
                  </span>
                </span>
                <span className="mt-1 block text-sm leading-snug text-muted">
                  {t(item.descriptionKey)}
                </span>
              </span>
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border transition",
                  selected
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-white text-transparent",
                )}
              >
                <Check aria-hidden="true" className="size-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <p className="text-sm font-black text-foreground">{t("setup.category")}</p>
          <p className="text-xs font-bold text-muted">
            {t("setup.available", { count: availableQuestions })}
          </p>
        </div>
        <div
          aria-label={t("setup.categoryGroup")}
          className="flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1"
          role="group"
        >
          {questionCategories.map((category) => {
            const selected = categoryId === category.id;
            const count = getContentCount(category.id);

            return (
              <button
                aria-pressed={selected}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                  selected
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-line bg-white text-foreground hover:border-primary/35 hover:bg-soft",
                )}
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
              >
                <CategoryIcon categoryId={category.id} />
                {t(`category.${category.id}`)}
                <span className={cn("text-[0.65rem]", selected ? "text-white/55" : "text-muted")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button className="mt-5" fullWidth size="large" onClick={onStart}>
        {t("setup.start")}
        <span aria-hidden="true">→</span>
      </Button>
    </section>
  );
}
