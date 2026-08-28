import { ArrowRight, Bot, Check, Clock3, Home, RotateCcw, Trophy, X } from "lucide-react";

import { cn, formatPercent, formatSeconds } from "@/shared/lib";
import { Button, TillarLogo } from "@/shared/ui";
import { RobotSequence, type RobotSequenceVariant } from "@/shared/ui/robot-sequence";

export interface GameResultStats {
  answered: number;
  averageResponseTimeMs: number;
  bestStreak: number;
  correct: number;
  errors: number;
}

type ResultTone = "success" | "neutral" | "danger";

interface GameResultViewProps {
  botLabel?: string;
  botStats: GameResultStats;
  categoryIcon?: string;
  categoryLabel: string;
  comparisonNote?: string;
  gameLabel: string;
  isSolo: boolean;
  onGoHome: () => void;
  onPlayAgain: () => void;
  playerStats: GameResultStats;
  robotVariant: RobotSequenceVariant;
  statusLabel: string;
  subtitle: string;
  title: string;
  tone: ResultTone;
}

function StatCard({
  label,
  tone = "default",
  value,
}: {
  label: string;
  tone?: "default" | "success" | "danger";
  value: string | number;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border border-line bg-white p-4",
        tone === "success" && "border-success/20 bg-success-soft",
        tone === "danger" && "border-danger/20 bg-danger-soft",
      )}
    >
      <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-[-0.05em] text-foreground">{value}</p>
    </div>
  );
}

function PlayerResultRow({
  bot = false,
  label,
  stats,
}: {
  bot?: boolean;
  label: string;
  stats: GameResultStats;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2.5 rounded-[1.15rem] bg-soft/75 p-3.5 sm:gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-xl",
            bot ? "bg-cyan-soft text-[#07869a]" : "bg-primary-soft text-primary",
          )}
        >
          {bot ? (
            <Bot aria-hidden="true" className="size-4" />
          ) : (
            <span className="text-xs font-black">ВЫ</span>
          )}
        </span>
        <span className="truncate text-sm font-black text-foreground">{label}</span>
      </div>
      <span className="flex items-center gap-1 text-sm font-black text-success">
        <Check aria-hidden="true" className="size-3.5" /> {stats.correct}
      </span>
      <span className="flex items-center gap-1 text-sm font-black text-danger">
        <X aria-hidden="true" className="size-3.5" /> {stats.errors}
      </span>
      <span className="flex items-center gap-1 text-xs font-bold text-muted">
        <Clock3 aria-hidden="true" className="size-3.5" />
        {stats.answered > 0 ? formatSeconds(stats.averageResponseTimeMs) : "—"}
      </span>
    </div>
  );
}

export function GameResultView({
  botLabel = "Tilli · бот",
  botStats,
  categoryIcon,
  categoryLabel,
  comparisonNote = "При равном счёте побеждает меньшее суммарное время ответа.",
  gameLabel,
  isSolo,
  onGoHome,
  onPlayAgain,
  playerStats,
  robotVariant,
  statusLabel,
  subtitle,
  title,
  tone,
}: GameResultViewProps) {
  const accuracy = playerStats.answered > 0 ? playerStats.correct / playerStats.answered : 0;

  return (
    <div className="app-noise min-h-dvh px-4 py-5 sm:px-6 sm:py-8">
      <main className="mx-auto w-full max-w-4xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2.5">
          <TillarLogo />
          <div className="flex flex-wrap justify-end gap-2">
            <span className="rounded-full border border-line bg-white px-3 py-2 text-xs font-black text-muted shadow-sm">
              {gameLabel}
            </span>
            <span className="rounded-full border border-line bg-white px-3 py-2 text-xs font-black text-muted shadow-sm">
              <span aria-hidden="true">{categoryIcon}</span> {categoryLabel}
            </span>
          </div>
        </div>

        <section className="animate-rise relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white p-5 shadow-[0_30px_90px_-38px_rgba(37,28,82,0.5)] sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-20 size-72 rounded-full bg-primary-soft blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div>
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.12em]",
                  tone === "success"
                    ? "bg-success-soft text-success"
                    : tone === "neutral"
                      ? "bg-primary-soft text-primary"
                      : "bg-danger-soft text-danger",
                )}
              >
                {tone === "success" ? (
                  <Trophy aria-hidden="true" className="size-4" />
                ) : tone === "neutral" ? (
                  <ArrowRight aria-hidden="true" className="size-4" />
                ) : (
                  <X aria-hidden="true" className="size-4" />
                )}
                {statusLabel}
              </span>
              <h1 className="mt-4 text-balance text-4xl font-black leading-none tracking-[-0.06em] text-foreground sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                {subtitle}
              </p>
            </div>

            <div className="relative mx-auto w-48 lg:w-64">
              <div className="absolute bottom-3 left-1/2 h-7 w-2/3 -translate-x-1/2 rounded-[50%] bg-primary/15 blur-lg" />
              <RobotSequence
                decorative
                className="relative drop-shadow-[0_20px_28px_rgba(36,28,70,0.24)]"
                variant={robotVariant}
              />
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <StatCard label="Раундов" value={playerStats.answered} />
            <StatCard label="Правильно" tone="success" value={playerStats.correct} />
            <StatCard
              label="Ошибок"
              tone={playerStats.errors > 0 ? "danger" : "default"}
              value={playerStats.errors}
            />
            <StatCard label="Точность" value={formatPercent(accuracy)} />
          </div>

          {!isSolo ? (
            <div className="relative mt-5 space-y-2.5 rounded-[1.5rem] border border-line bg-white p-3">
              <PlayerResultRow label="Вы" stats={playerStats} />
              <PlayerResultRow bot label={botLabel} stats={botStats} />
              <p className="px-1 pt-1 text-center text-[0.67rem] font-bold text-muted">
                {comparisonNote}
              </p>
            </div>
          ) : (
            <div className="relative mt-5 rounded-[1.4rem] bg-soft/70 p-4">
              <p className="text-xs font-black uppercase tracking-[0.11em] text-muted">
                Лучшая серия
              </p>
              <p className="mt-1 flex items-baseline gap-2 text-2xl font-black tracking-[-0.04em] text-foreground">
                {playerStats.bestStreak}
                <span className="text-sm font-bold text-muted">ответа подряд</span>
              </p>
            </div>
          )}

          <div className="relative mt-6 grid gap-2.5 sm:grid-cols-2">
            <Button fullWidth size="large" onClick={onPlayAgain}>
              <RotateCcw aria-hidden="true" className="size-4" />
              Играть ещё
            </Button>
            <Button fullWidth size="large" variant="secondary" onClick={onGoHome}>
              <Home aria-hidden="true" className="size-4" />
              На главную
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
