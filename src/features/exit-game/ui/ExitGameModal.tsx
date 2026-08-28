import { DoorOpen } from "lucide-react";

import { Button, Modal } from "@/shared/ui";

interface ExitGameModalProps {
  mode: "solo" | "duel-demo";
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
}

export function ExitGameModal({ mode, onCancel, onConfirm, open }: ExitGameModalProps) {
  const isSolo = mode === "solo";

  return (
    <Modal dismissible label="Завершение игры" open={open} onClose={onCancel}>
      <span className="grid size-12 place-items-center rounded-2xl bg-danger-soft text-danger">
        <DoorOpen aria-hidden="true" className="size-5" />
      </span>
      <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-foreground">
        {isSolo ? "Завершить сессию?" : "Покинуть дуэль?"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {isSolo
          ? "Мы покажем статистику по уже отвеченным вопросам."
          : "Демо-матч будет сброшен, текущий результат не сохранится."}
      </p>
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        <Button fullWidth variant="secondary" onClick={onCancel}>
          Остаться
        </Button>
        <Button fullWidth variant="danger" onClick={onConfirm}>
          {isSolo ? "Завершить" : "Выйти"}
        </Button>
      </div>
    </Modal>
  );
}
