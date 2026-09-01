import { Check, X } from "lucide-react";

import { type PlayerAnswer } from "@/entities/game-session";
import { PictureArtwork, type PictureQuestion, type QuestionOptionId } from "@/entities/question";

import { useI18n } from "@/shared/config";
import { cn } from "@/shared/lib";

interface PictureChoicesProps {
  answer: PlayerAnswer | null;
  disabled?: boolean;
  onAnswer: (optionId: QuestionOptionId) => void;
  question: PictureQuestion;
}

export function PictureChoices({
  answer,
  disabled = false,
  onAnswer,
  question,
}: PictureChoicesProps) {
  const { t } = useI18n();
  return (
    <div
      aria-label={t("board.options")}
      className="grid gap-3 sm:grid-cols-2 sm:gap-4"
      role="group"
    >
      {question.options.map((option, index) => {
        const isSelected = answer?.optionId === option.id;
        const isCorrect = answer ? question.correctOptionId === option.id : false;
        const isIncorrectSelection = isSelected && !answer?.isCorrect;

        return (
          <button
            aria-label={t("common.variant", { label: option.ariaLabel, number: index + 1 })}
            className={cn(
              "group relative min-h-44 overflow-hidden rounded-[1.65rem] border-[3px] bg-white p-2 text-left shadow-[0_16px_38px_-24px_rgba(34,27,71,0.4)] transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 sm:min-h-52",
              !answer &&
                !disabled &&
                "border-white hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_22px_46px_-20px_rgba(82,61,169,0.45)]",
              answer && isCorrect && "border-success bg-success-soft",
              answer && isIncorrectSelection && "border-danger bg-danger-soft",
              answer && !isCorrect && !isIncorrectSelection && "border-white opacity-55",
              disabled && !answer && "cursor-wait border-white opacity-75",
            )}
            disabled={disabled || Boolean(answer)}
            key={option.id}
            type="button"
            onClick={() => onAnswer(option.id)}
          >
            <PictureArtwork
              ariaLabel={option.ariaLabel}
              className="aspect-[16/11] h-full w-full rounded-[1.25rem]"
              visualKey={option.visualKey}
            />
            <span className="absolute left-4 top-4 grid size-9 place-items-center rounded-xl border border-white/35 bg-ink/65 text-sm font-black text-white shadow-sm backdrop-blur">
              {index === 0 ? "A" : "B"}
            </span>
            {answer && (isCorrect || isIncorrectSelection) ? (
              <span
                className={cn(
                  "absolute right-4 top-4 grid size-10 place-items-center rounded-full border-4 border-white text-white shadow-lg",
                  isCorrect ? "bg-success" : "bg-danger",
                )}
              >
                {isCorrect ? (
                  <Check aria-hidden="true" className="size-5" strokeWidth={3} />
                ) : (
                  <X aria-hidden="true" className="size-5" strokeWidth={3} />
                )}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
