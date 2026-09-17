import { type ReactNode } from "react";

import { ArrowRight, Bot, Check, Clock3, Home, RotateCcw, Trophy, X } from "lucide-react";

import { useI18n } from "@/shared/config";
import { cn, formatPercent, formatSeconds } from "@/shared/lib";
import { Button } from "@/shared/ui";
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
  categoryIcon?: ReactNode;
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
  const { language, t } = useI18n();
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2.5 rounded-[1.15rem] bg-soft/75 p-3.5 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:gap-3">
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
            <span className="text-xs font-black">{t("common.you").toUpperCase()}</span>
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
      <span className="col-span-3 flex items-center justify-end gap-1 text-xs font-bold text-muted sm:col-span-1">
        <Clock3 aria-hidden="true" className="size-3.5" />
        {stats.answered > 0 ? formatSeconds(stats.averageResponseTimeMs, language) : "—"}
      </span>
    </div>
  );
}

export function GameResultView({
  botLabel,
  botStats,
  categoryIcon,
  categoryLabel,
  comparisonNote,
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
  const { t } = useI18n();
  const accuracy = playerStats.answered > 0 ? playerStats.correct / playerStats.answered : 0;

  return (
    <div className="app-noise min-h-dvh">
      <main className="safe-bottom mx-auto w-full max-w-4xl px-4 pb-8 pt-5 sm:px-6">
        <section className="animate-rise relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white p-5 shadow-[0_30px_90px_-38px_rgba(37,28,82,0.5)] sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-20 size-72 rounded-full bg-primary-soft blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div>
              <p className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold text-muted">
                <span>{gameLabel}</span>
                <span aria-hidden="true">·</span>
                <span aria-hidden="true">{categoryIcon}</span>
                <span>{categoryLabel}</span>
              </p>
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
                startDelayMs={520}
                variant={robotVariant}
              />
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <StatCard label={t("result.rounds")} value={playerStats.answered} />
            <StatCard label={t("result.correct")} tone="success" value={playerStats.correct} />
            <StatCard
              label={t("result.errors")}
              tone={playerStats.errors > 0 ? "danger" : "default"}
              value={playerStats.errors}
            />
            <StatCard label={t("result.accuracy")} value={formatPercent(accuracy)} />
          </div>

          {!isSolo ? (
            <div className="relative mt-5 space-y-2.5 rounded-[1.5rem] border border-line bg-white p-3">
              <PlayerResultRow label={t("common.you")} stats={playerStats} />
              <PlayerResultRow bot label={botLabel ?? t("common.bot")} stats={botStats} />
              <p className="px-1 pt-1 text-center text-[0.67rem] font-bold text-muted">
                {comparisonNote ?? t("result.comparison")}
              </p>
            </div>
          ) : (
            <div className="relative mt-5 rounded-[1.4rem] bg-soft/70 p-4">
              <p className="text-xs font-black uppercase tracking-[0.11em] text-muted">
                {t("result.bestStreak")}
              </p>
              <p className="mt-1 flex items-baseline gap-2 text-2xl font-black tracking-[-0.04em] text-foreground">
                {playerStats.bestStreak}
                <span className="text-sm font-bold text-muted">{t("result.streakSuffix")}</span>
              </p>
            </div>
          )}

          <div className="relative mt-6 grid gap-2.5 sm:grid-cols-2">
            <Button fullWidth size="large" onClick={onPlayAgain}>
              <RotateCcw aria-hidden="true" className="size-4" />
              {t("result.playAgain")}
            </Button>
            <Button fullWidth size="large" variant="secondary" onClick={onGoHome}>
              <Home aria-hidden="true" className="size-4" />
              {t("result.home")}
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
