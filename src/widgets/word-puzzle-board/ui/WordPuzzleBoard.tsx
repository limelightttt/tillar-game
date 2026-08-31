import { Bot, Check, Clock3, X } from "lucide-react";

import { WordComposer } from "@/features/compose-word";
import { questionCategories } from "@/entities/question";
import {
  type WordBotAnswer,
  type WordGameMode,
  type WordGameStatus,
  type WordPlayerAnswer,
} from "@/entities/word-game-session";
import {
  getWordLength,
  type LetterTile,
  type LetterTileId,
  type WordPuzzle,
  WordPuzzleArtwork,
} from "@/entities/word-puzzle";

import { cn, formatSeconds } from "@/shared/lib";

interface WordPuzzleBoardProps {
  botAnswer: WordBotAnswer | null;
  elapsedResponseTimeMs: number;
  letterTiles: readonly LetterTile[];
  mode: WordGameMode;
  onClear: () => void;
  onRemoveTile: (tileId: LetterTileId) => void;
  onSelectTile: (tileId: LetterTileId) => void;
  onSubmit: () => void;
  playerAnswer: WordPlayerAnswer | null;
  puzzle: WordPuzzle;
  selectedTileIds: readonly LetterTileId[];
  status: WordGameStatus;
}

function DuelRoundStatus({
  botAnswer,
  playerAnswer,
}: {
  botAnswer: WordBotAnswer | null;
  playerAnswer: WordPlayerAnswer | null;
}) {
  if (!playerAnswer) return null;

  return (
    <div
      aria-atomic="true"
      aria-live="assertive"
      className={cn(
        "mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border px-4 py-3 text-sm",
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
            {playerAnswer.isCorrect ? "Слово принято" : "Ошибка · минус жизнь"}
          </strong>
          <span className="ml-2 text-muted">{formatSeconds(playerAnswer.responseTimeMs)}</span>
        </span>
      </div>
      <div className="flex items-center gap-2 font-bold text-muted">
        <Bot aria-hidden="true" className="size-4 text-primary" />
        {botAnswer ? (
          <span>
            Бот {botAnswer.isCorrect ? "собрал слово" : "ошибся"} ·{" "}
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

export function WordPuzzleBoard({
  botAnswer,
  elapsedResponseTimeMs,
  letterTiles,
  mode,
  onClear,
  onRemoveTile,
  onSelectTile,
  onSubmit,
  playerAnswer,
  puzzle,
  selectedTileIds,
  status,
}: WordPuzzleBoardProps) {
  const category = questionCategories.find((item) => item.id === puzzle.categoryId);

  return (
    <section className="tillar-surface rounded-[2rem] border p-4 backdrop-blur sm:p-6 lg:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-2 text-xs font-black text-primary">
          <span aria-hidden="true">{category?.icon ?? "✨"}</span>
          {category?.label ?? "Головоломка"}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-soft/65 px-3 py-2 text-xs font-black text-muted">
          <Clock3 aria-hidden="true" className="size-3.5" />
          <span aria-live="off">{formatSeconds(elapsedResponseTimeMs)}</span>
        </div>
      </div>

      <div className="mb-5 sm:mb-6">
        <h1 className="text-balance max-w-4xl text-2xl font-black leading-tight tracking-[-0.045em] text-foreground sm:text-3xl lg:text-[2.15rem]">
          {puzzle.prompt}
        </h1>
      </div>

      {mode === "duel-demo" ? (
        <DuelRoundStatus botAnswer={botAnswer} playerAnswer={playerAnswer} />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-start lg:gap-6">
        <div
          aria-label="Четыре визуальные подсказки"
          className="grid grid-cols-2 gap-2.5 sm:gap-3"
          role="group"
        >
          {puzzle.images.map((image, index) => (
            <WordPuzzleArtwork image={image} index={index} key={image.id} />
          ))}
        </div>

        <WordComposer
          answerLength={getWordLength(puzzle.answer)}
          disabled={status !== "playing" || Boolean(playerAnswer)}
          letterTiles={letterTiles}
          selectedTileIds={selectedTileIds}
          onClear={onClear}
          onRemoveTile={onRemoveTile}
          onSelectTile={onSelectTile}
          onSubmit={onSubmit}
        />
      </div>
    </section>
  );
}
