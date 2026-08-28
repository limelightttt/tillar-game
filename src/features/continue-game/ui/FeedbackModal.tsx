import { ArrowRight, Check, Lightbulb, X } from "lucide-react";

import { type EducationalFeedback, type PlayerAnswer } from "@/entities/game-session";
import { type PictureQuestion } from "@/entities/question";

import { cn } from "@/shared/lib";
import { Button, Modal } from "@/shared/ui";
import { RobotSequence } from "@/shared/ui/robot-sequence";

interface FeedbackModalProps {
  answer: PlayerAnswer | null;
  feedback: EducationalFeedback | null;
  onContinue: () => void;
  open: boolean;
  question: PictureQuestion | null;
}

export function FeedbackModal({
  answer,
  feedback,
  onContinue,
  open,
  question,
}: FeedbackModalProps) {
  if (!question || !answer || !feedback) return null;

  const correct = feedback.kind === "correct";
  const correctOptionIndex = question.options.findIndex(
    (option) => option.id === question.correctOptionId,
  );
  const correctOption = question.options[correctOptionIndex];

  return (
    <Modal label={correct ? "Правильный ответ" : "Неправильный ответ"} open={open}>
      <div className="absolute -right-16 -top-20 size-52 rounded-full bg-primary-soft blur-2xl" />
      <div className="relative grid gap-5 sm:grid-cols-[9rem_1fr] sm:items-center">
        <div
          className={cn(
            "mx-auto grid size-32 place-items-end overflow-visible rounded-[2rem] sm:size-36",
            correct ? "bg-success-soft" : "bg-danger-soft",
          )}
        >
          <RobotSequence
            decorative
            className="w-[8.75rem] translate-y-2"
            key={`${question.id}-${feedback.kind}`}
            variant={correct ? "jump" : "squat"}
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
            {correct ? "Да, правильно" : "Почти получилось"}
          </p>
          <h2 className="mt-1 text-3xl font-black tracking-[-0.05em] text-foreground">
            {correct ? "Точно в цель!" : "Запомним ответ"}
          </h2>
        </div>
      </div>

      {!correct ? (
        <>
          <div className="relative mt-5 rounded-[1.25rem] border border-danger/15 bg-danger-soft p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-danger">
              Почему не этот вариант
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{feedback.text}</p>
          </div>
          {correctOption ? (
            <div className="relative mt-3 rounded-[1.25rem] border border-success/20 bg-success-soft p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-success">
                Правильный ответ
              </p>
              <p className="mt-1.5 text-sm font-black text-foreground">
                Вариант {correctOptionIndex === 0 ? "A" : "B"}: {correctOption.ariaLabel}
              </p>
            </div>
          ) : null}
        </>
      ) : null}

      <div className="relative mt-3 rounded-[1.25rem] border border-primary/15 bg-primary-soft p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-primary">
          <Lightbulb aria-hidden="true" className="size-4" />
          Факт в копилку
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/82">
          {correct ? feedback.text : question.correctFact}
        </p>
      </div>

      <Button className="relative mt-5" fullWidth size="large" onClick={onContinue}>
        Продолжить
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </Modal>
  );
}
