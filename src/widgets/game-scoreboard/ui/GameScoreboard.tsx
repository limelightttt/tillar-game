import { Bot, Check, Flame, Heart, Timer, UserRound } from "lucide-react";

import { cn, formatSeconds } from "@/shared/lib";
import { ProgressBar } from "@/shared/ui";

interface ScoreStats {
  answered: number;
  averageResponseTimeMs: number;
  bestStreak: number;
  correct: number;
}

interface GameScoreboardProps {
  botLives: number;
  botStats: ScoreStats;
  currentRound: number;
  mode: "solo" | "duel-demo";
  playerLives: number;
  playerStats: ScoreStats;
  roundCount?: number;
  startingLives?: number;
}

function Lives({ label, maximum, value }: { label: string; maximum: number; value: number }) {
  return (
    <span aria-label={`${label}: ${value} из ${maximum}`} className="inline-flex gap-1">
      {Array.from({ length: maximum }, (_, index) => (
        <Heart
          aria-hidden="true"
          className={cn(
            "size-3.5 transition",
            index < value ? "fill-danger text-danger" : "fill-line text-line",
          )}
          key={index}
        />
      ))}
    </span>
  );
}

function SoloScoreboard({ stats }: { stats: ScoreStats }) {
  const values = [
    { icon: Check, label: "Верно", value: stats.correct },
    { icon: Flame, label: "Лучшая серия", value: stats.bestStreak },
    {
      icon: Timer,
      label: "Среднее время",
      value: stats.answered > 0 ? formatSeconds(stats.averageResponseTimeMs) : "—",
    },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-2 rounded-[1.35rem] border border-line bg-white p-2 shadow-sm">
      {values.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            aria-label={`${item.label}: ${item.value}`}
            className={cn(
              "flex min-w-0 flex-col items-center justify-center rounded-2xl px-2 py-2.5 text-center",
              index === 0 && "bg-success-soft",
            )}
            key={item.label}
          >
            <span className="mb-1 flex items-center gap-1 text-[0.62rem] font-black uppercase tracking-[0.09em] text-muted">
              <Icon aria-hidden="true" className={cn("size-3", index === 0 && "text-success")} />
              <span className="hidden sm:inline">{item.label}</span>
            </span>
            <strong className="truncate text-base font-black tracking-[-0.03em] text-foreground sm:text-lg">
              {item.value}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

function DuelPlayerCard({
  actor,
  label,
  lives,
  maximumLives,
  stats,
}: {
  actor: "bot" | "player";
  label: string;
  lives: number;
  maximumLives: number;
  stats: ScoreStats;
}) {
  const Icon = actor === "player" ? UserRound : Bot;

  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-[1.15rem] bg-white p-2.5 shadow-sm sm:gap-3 sm:p-3">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          actor === "player" ? "bg-primary-soft text-primary" : "bg-cyan-soft text-[#08879a]",
        )}
      >
        <Icon aria-hidden="true" className="size-4.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-black text-foreground sm:text-sm">{label}</span>
          <strong className="text-lg font-black tracking-[-0.04em] text-foreground">
            {stats.correct}
          </strong>
        </span>
        <span className="mt-1 flex items-center justify-between gap-1">
          <Lives label={`Жизни ${label}`} maximum={maximumLives} value={lives} />
          <span className="text-[0.62rem] font-bold text-muted">
            {stats.answered > 0 ? formatSeconds(stats.averageResponseTimeMs) : "—"}
          </span>
        </span>
      </span>
    </div>
  );
}

export function GameScoreboard({
  botLives,
  botStats,
  currentRound,
  mode,
  playerLives,
  playerStats,
  roundCount = 8,
  startingLives = 3,
}: GameScoreboardProps) {
  if (mode === "solo") {
    return <SoloScoreboard stats={playerStats} />;
  }

  return (
    <section
      aria-label="Счёт дуэли"
      className="rounded-[1.55rem] border border-line bg-soft/75 p-2.5 sm:p-3"
    >
      <div className="grid gap-2.5 sm:grid-cols-2">
        <DuelPlayerCard
          actor="player"
          label="Вы"
          lives={playerLives}
          maximumLives={startingLives}
          stats={playerStats}
        />
        <DuelPlayerCard
          actor="bot"
          label="Tilli · бот"
          lives={botLives}
          maximumLives={startingLives}
          stats={botStats}
        />
      </div>
      <div className="mt-3 flex items-center gap-3 px-1">
        <ProgressBar
          className="flex-1"
          label={`Раунд ${currentRound} из ${roundCount}`}
          value={(currentRound / roundCount) * 100}
        />
        <span className="shrink-0 text-[0.65rem] font-black uppercase tracking-[0.1em] text-muted">
          {currentRound}/{roundCount}
        </span>
      </div>
    </section>
  );
}
