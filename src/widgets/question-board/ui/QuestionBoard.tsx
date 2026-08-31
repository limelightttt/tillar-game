import { Bot, Check, Clock3, X } from "lucide-react";

import { PictureChoices } from "@/features/answer-picture";
import {
  type BotAnswer,
  type GameMode,
  type GameStatus,
  type PlayerAnswer,
} from "@/entities/game-session";
import {
  type PictureQuestion,
  questionCategories,
  type QuestionOptionId,
} from "@/entities/question";

import { cn, formatSeconds } from "@/shared/lib";

interface QuestionBoardProps {
  botAnswer: BotAnswer | null;
  elapsedResponseTimeMs: number;
  mode: GameMode;
  onAnswer: (optionId: QuestionOptionId) => void;
  playerAnswer: PlayerAnswer | null;
  question: PictureQuestion;
  status: GameStatus;
}

function DuelRoundStatus({
  botAnswer,
  playerAnswer,
}: {
  botAnswer: BotAnswer | null;
  playerAnswer: PlayerAnswer | null;
}) {
  if (!playerAnswer) return null;

  return (
    <div
      aria-atomic="true"
      aria-live="assertive"
      className={cn(
        "mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border px-4 py-3 text-sm",
        botAnswer ? "border-line bg-soft" : "border-cyan/25 bg-cyan-soft",
      )}
      role="status"
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid size-8 place-items-center rounded-full text-white",
            playerAnswer.isCorrect ? "bg-success" : "bg-danger",
          )}
        >
          {playerAnswer.isCorrect ? (
            <Check aria-hidden="true" className="size-4" strokeWidth={3} />
          ) : (
            <X aria-hidden="true" className="size-4" strokeWidth={3} />
          )}
        </span>
        <span>
          <strong className="font-black text-foreground">
            {playerAnswer.isCorrect ? "Ответ принят" : "Ошибка · минус жизнь"}
          </strong>
          <span className="ml-2 text-muted">{formatSeconds(playerAnswer.responseTimeMs)}</span>
        </span>
      </div>
      <div className="flex items-center gap-2 font-bold text-muted">
        <Bot aria-hidden="true" className="size-4 text-primary" />
        {botAnswer ? (
          <span>
            Бот {botAnswer.isCorrect ? "ответил верно" : "ошибся"} ·{" "}
            {formatSeconds(botAnswer.responseTimeMs)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            Бот думает
            <span className="inline-flex gap-1" aria-hidden="true">
              <span className="size-1 animate-pulse rounded-full bg-primary" />
              <span className="size-1 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
              <span className="size-1 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

export function QuestionBoard({
  botAnswer,
  elapsedResponseTimeMs,
  mode,
  onAnswer,
  playerAnswer,
  question,
  status,
}: QuestionBoardProps) {
  const category = questionCategories.find((item) => item.id === question.categoryId);

  return (
    <section className="tillar-surface rounded-[2rem] border p-4 backdrop-blur sm:p-6 lg:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-2 text-xs font-black text-primary">
          <span aria-hidden="true">{category?.icon ?? "✨"}</span>
          {category?.label ?? "Вопрос"}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-soft/65 px-3 py-2 text-xs font-black text-muted">
          <Clock3 aria-hidden="true" className="size-3.5" />
          <span aria-live="off">{formatSeconds(elapsedResponseTimeMs)}</span>
        </div>
      </div>

      <div className="mb-5 sm:mb-6">
        <h1 className="text-balance max-w-4xl text-2xl font-black leading-tight tracking-[-0.045em] text-foreground sm:text-3xl lg:text-[2.15rem]">
          {question.prompt}
        </h1>
      </div>

      {mode === "duel-demo" ? (
        <DuelRoundStatus botAnswer={botAnswer} playerAnswer={playerAnswer} />
      ) : null}

      <PictureChoices
        answer={playerAnswer}
        disabled={status !== "playing"}
        question={question}
        onAnswer={onAnswer}
      />
    </section>
  );
}
