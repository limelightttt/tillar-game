import { Check, Heart, Sparkles, UserRound, UsersRound } from "lucide-react";

import { type GameMode } from "@/entities/game-session";
import {
  type CategoryId,
  filterQuestionsByCategory,
  pictureQuestions,
  questionCategories,
} from "@/entities/question";

import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

interface GameSetupProps {
  categoryId: CategoryId;
  mode: GameMode;
  onCategoryChange: (categoryId: CategoryId) => void;
  onModeChange: (mode: GameMode) => void;
  onStart: () => void;
}

const modes = [
  {
    id: "solo",
    title: "Играть одному",
    description: "Объяснение после каждого ответа, без тайм-лимита",
    icon: UserRound,
  },
  {
    id: "duel-demo",
    title: "Дуэль с ботом",
    description: "Демо правил: 3 жизни и 8 быстрых раундов",
    icon: UsersRound,
  },
] as const satisfies readonly {
  description: string;
  icon: typeof UserRound;
  id: GameMode;
  title: string;
}[];

export function GameSetup({
  categoryId,
  mode,
  onCategoryChange,
  onModeChange,
  onStart,
}: GameSetupProps) {
  const getContentCount = (targetCategoryId: CategoryId) =>
    filterQuestionsByCategory(pictureQuestions, targetCategoryId).length;

  return (
    <section
      aria-labelledby="game-setup-title"
      className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_70px_-35px_rgba(37,28,82,0.35)] backdrop-blur sm:p-7"
      id="game-setup"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
            Настрой игру 01
          </p>
          <h2 className="text-2xl font-black text-foreground" id="game-setup-title">
            Как играем?
          </h2>
        </div>
        <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Sparkles aria-hidden="true" className="size-5" />
        </span>
      </div>

      <div aria-label="Режим игры" className="grid gap-3" role="group">
        {modes.map((item) => {
          const Icon = item.icon;
          const selected = mode === item.id;

          return (
            <button
              aria-pressed={selected}
              className={cn(
                "flex min-h-[5.5rem] items-center gap-4 rounded-[1.4rem] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                selected ? "border-primary bg-primary-soft" : "border-line bg-white",
              )}
              key={item.id}
              type="button"
              onClick={() => onModeChange(item.id)}
            >
              <span
                className={cn(
                  "grid size-12 place-items-center rounded-2xl",
                  selected ? "bg-primary text-white" : "bg-soft text-muted",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-black text-foreground">{item.title}</span>
                <span className="mt-1 block text-sm text-muted">{item.description}</span>
              </span>
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full border",
                  selected
                    ? "border-primary bg-primary text-white"
                    : "border-line text-transparent",
                )}
              >
                <Check aria-hidden="true" className="size-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        <p className="mb-3 text-sm font-black text-foreground">Выбери тему</p>
        <div
          aria-label="Категория вопросов"
          className="flex max-h-40 flex-wrap gap-2 overflow-y-auto"
          role="group"
        >
          {questionCategories.map((category) => {
            const selected = categoryId === category.id;
            return (
              <button
                aria-pressed={selected}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold",
                  selected
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-foreground",
                )}
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
              >
                <span aria-hidden="true">{category.icon}</span>
                {category.label}
                <span className={selected ? "text-white/55" : "text-muted"}>
                  {getContentCount(category.id)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-7 flex items-center gap-2 rounded-[1.25rem] bg-soft/75 p-3.5 text-xs font-bold text-muted">
        <Heart aria-hidden="true" className="size-4 fill-danger text-danger" />
        {mode === "solo"
          ? "Сессию можно завершить в любой момент."
          : "Это демо с ботом; реальный онлайн потребует сервер TILLAR."}
      </p>

      <Button className="mt-5" fullWidth size="large" onClick={onStart}>
        Начать игру с картинками <span aria-hidden="true">→</span>
      </Button>
    </section>
  );
}
