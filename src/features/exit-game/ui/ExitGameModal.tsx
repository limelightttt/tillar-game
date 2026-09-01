import { DoorOpen } from "lucide-react";

import { useI18n } from "@/shared/config";
import { Button, Modal } from "@/shared/ui";

interface ExitGameModalProps {
  mode: "solo" | "duel-demo";
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
}

export function ExitGameModal({ mode, onCancel, onConfirm, open }: ExitGameModalProps) {
  const { t } = useI18n();
  const isSolo = mode === "solo";

  return (
    <Modal dismissible label={t("exit.label")} open={open} onClose={onCancel}>
      <span className="grid size-12 place-items-center rounded-2xl bg-danger-soft text-danger">
        <DoorOpen aria-hidden="true" className="size-5" />
      </span>
      <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-foreground">
        {t(isSolo ? "exit.soloTitle" : "exit.duelTitle")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {isSolo ? t("exit.soloText") : t("exit.duelText")}
      </p>
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        <Button fullWidth variant="secondary" onClick={onCancel}>
          {t("exit.stay")}
        </Button>
        <Button fullWidth variant="danger" onClick={onConfirm}>
          {t(isSolo ? "exit.finish" : "exit.leave")}
        </Button>
      </div>
    </Modal>
  );
}
