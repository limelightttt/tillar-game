import { type KeyboardEvent } from "react";

import { Check, RotateCcw } from "lucide-react";

import { buildWordFromTiles, type LetterTile, type LetterTileId } from "@/entities/word-puzzle";

import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

interface WordComposerProps {
  answerLength: number;
  disabled?: boolean;
  letterTiles: readonly LetterTile[];
  onClear: () => void;
  onRemoveTile: (tileId: LetterTileId) => void;
  onSelectTile: (tileId: LetterTileId) => void;
  onSubmit: () => void;
  selectedTileIds: readonly LetterTileId[];
}

export function WordComposer({
  answerLength,
  disabled = false,
  letterTiles,
  onClear,
  onRemoveTile,
  onSelectTile,
  onSubmit,
  selectedTileIds,
}: WordComposerProps) {
  const selectedIdSet = new Set(selectedTileIds);
  const selectedTiles = selectedTileIds
    .map((tileId) => letterTiles.find((tile) => tile.id === tileId))
    .filter((tile): tile is LetterTile => Boolean(tile));
  const selectedWord = buildWordFromTiles(letterTiles, selectedTileIds);
  const complete = selectedTileIds.length === answerLength;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key.length === 1 && /^[а-яё]$/iu.test(event.key)) {
      const requestedLetter = event.key.toLocaleUpperCase("ru-RU");
      const tile = letterTiles.find(
        (candidate) => candidate.letter === requestedLetter && !selectedIdSet.has(candidate.id),
      );

      if (tile && selectedTileIds.length < answerLength) {
        event.preventDefault();
        onSelectTile(tile.id);
      }
      return;
    }

    if (event.key !== "Backspace" || selectedTileIds.length === 0) return;

    event.preventDefault();
    const lastTileId = selectedTileIds.at(-1);
    if (lastTileId) onRemoveTile(lastTileId);
  };

  return (
    <div
      aria-label="Составление слова"
      className="rounded-[1.55rem] border border-line bg-soft/55 p-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:p-5"
      role="group"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-primary">
            Твой ответ
          </p>
          <p className="mt-0.5 text-xs font-bold text-muted">{answerLength} букв</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[0.65rem] font-black text-muted shadow-sm">
          {selectedTileIds.length}/{answerLength}
        </span>
      </div>

      <div
        aria-label={`Составленное слово: ${selectedWord || "пока пусто"}`}
        aria-live="polite"
        className="mt-4 flex min-h-12 flex-wrap justify-center gap-1.5"
      >
        {Array.from({ length: answerLength }, (_, index) => {
          const tile = selectedTiles[index];

          return tile ? (
            <button
              aria-label={`Убрать букву ${tile.letter} из позиции ${index + 1}`}
              className="grid size-11 place-items-center rounded-xl border-2 border-primary bg-white text-lg font-black text-foreground shadow-[0_8px_18px_-13px_rgba(75,52,171,0.9)] transition hover:-translate-y-0.5 hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none"
              disabled={disabled}
              key={`${index}-${tile.id}`}
              type="button"
              onClick={() => onRemoveTile(tile.id)}
            >
              {tile.letter}
            </button>
          ) : (
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-xl border-2 border-dashed border-line bg-white/65 text-muted/30"
              key={`empty-${index}`}
            >
              ·
            </span>
          );
        })}
      </div>

      <div
        aria-label="Доступные буквы"
        className="mt-5 flex flex-wrap justify-center gap-2"
        role="group"
      >
        {letterTiles.map((tile) => {
          const selected = selectedIdSet.has(tile.id);

          return (
            <button
              aria-label={
                selected ? `Буква ${tile.letter} уже выбрана` : `Добавить букву ${tile.letter}`
              }
              className={cn(
                "grid size-12 place-items-center rounded-[0.9rem] border text-lg font-black shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                selected
                  ? "border-line bg-white/45 text-muted/25 shadow-none"
                  : "border-white bg-white text-foreground hover:-translate-y-0.5 hover:border-primary/35 hover:text-primary",
              )}
              disabled={disabled || selected || selectedTileIds.length >= answerLength}
              key={tile.id}
              type="button"
              onClick={() => onSelectTile(tile.id)}
            >
              {tile.letter}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-[auto_1fr] gap-2.5">
        <Button
          aria-label="Очистить составленное слово"
          disabled={disabled || selectedTileIds.length === 0}
          size="icon"
          variant="secondary"
          onClick={onClear}
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </Button>
        <Button disabled={disabled || !complete} fullWidth onClick={onSubmit}>
          <Check aria-hidden="true" className="size-4" />
          Проверить слово
        </Button>
      </div>
    </div>
  );
}
