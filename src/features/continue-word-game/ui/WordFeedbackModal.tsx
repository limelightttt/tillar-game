import { ArrowRight, Check, Lightbulb, X } from "lucide-react";

import { type WordEducationalFeedback, type WordPlayerAnswer } from "@/entities/word-game-session";
import { type WordPuzzle } from "@/entities/word-puzzle";

import { cn } from "@/shared/lib";
import { Button, Modal } from "@/shared/ui";
import { RobotSequence } from "@/shared/ui/robot-sequence";

interface WordFeedbackModalProps {
  answer: WordPlayerAnswer | null;
  feedback: WordEducationalFeedback | null;
  onContinue: () => void;
  open: boolean;
  puzzle: WordPuzzle | null;
}

export function WordFeedbackModal({
  answer,
  feedback,
  onContinue,
  open,
  puzzle,
}: WordFeedbackModalProps) {
  if (!puzzle || !answer || !feedback) return null;

  const correct = feedback.kind === "correct";

  return (
    <Modal label={correct ? "Правильный ответ" : "Неправильный ответ"} open={open}>
      <div className="absolute -right-16 -top-20 size-52 rounded-full bg-primary-soft blur-2xl" />
      <div className="relative grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center sm:gap-5">
        <div
          className={cn(
            "mx-auto grid size-32 place-items-center overflow-hidden rounded-[2rem] p-1",
            correct ? "bg-success-soft" : "bg-danger-soft",
          )}
        >
          <RobotSequence
            decorative
            className="size-full drop-shadow-[0_14px_18px_rgba(28,25,48,0.2)]"
            replayKey={`${puzzle.id}-${feedback.kind}`}
            startDelayMs={240}
            variant={correct ? "celebrate" : "encourage"}
          />
        </div>

        <div className="text-center sm:text-left">
          <span
            className={cn(
              "mx-auto mb-3 inline-flex size-9 items-center justify-center rounded-full text-white sm:mx-0",
              correct ? "bg-success" : "bg-danger",
            )}
          >
            {correct ? (
              <Check aria-hidden="true" className="size-5" strokeWidth={3} />
            ) : (
              <X aria-hidden="true" className="size-5" strokeWidth={3} />
            )}
          </span>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">
            {correct ? "Да, правильно" : "Есть новая подсказка"}
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-foreground sm:text-3xl">
            {correct ? "Слово найдено!" : "Запомним слово"}
          </h2>
        </div>
      </div>

      <div
        className={cn(
          "relative mt-5 rounded-[1.25rem] border p-4 text-center",
          correct ? "border-success/20 bg-success-soft" : "border-danger/20 bg-danger-soft",
        )}
      >
        {!correct ? (
          <p className="text-xs font-black uppercase tracking-[0.12em] text-danger">
            Твой ответ: {feedback.submittedWord}
          </p>
        ) : null}
        <p className="mt-1 text-[0.68rem] font-black uppercase tracking-[0.15em] text-muted">
          Правильное слово
        </p>
        <p className="mt-1 break-words text-2xl font-black tracking-[0.06em] text-foreground sm:text-3xl sm:tracking-[0.08em]">
          {feedback.correctWord}
        </p>
      </div>

      <div className="relative mt-3 rounded-[1.25rem] border border-primary/15 bg-primary-soft p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-primary">
          <Lightbulb aria-hidden="true" className="size-4" />
          Почему это слово
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/82">{feedback.explanation}</p>
      </div>

      <Button className="relative mt-5" fullWidth size="large" onClick={onContinue}>
        Продолжить
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </Modal>
  );
}
