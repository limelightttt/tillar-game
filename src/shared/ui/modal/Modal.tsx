import { type ReactNode, useEffect, useRef } from "react";

import { X } from "lucide-react";

import { cn } from "@/shared/lib";

interface ModalProps {
  children: ReactNode;
  className?: string;
  dismissible?: boolean;
  label: string;
  onClose?: () => void;
  open: boolean;
}

export function Modal({
  children,
  className,
  dismissible = false,
  label,
  onClose,
  open,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      aria-label={label}
      className={cn(
        "modal-dialog m-auto max-h-[calc(100dvh-1rem)] w-[min(92vw,34rem)] overflow-y-auto overscroll-contain rounded-[2rem] border-0 bg-transparent p-0 text-foreground backdrop:bg-ink/55 backdrop:backdrop-blur-sm sm:max-h-[calc(100dvh-2rem)]",
        className,
      )}
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        if (dismissible) onClose?.();
      }}
    >
      <div className="modal-surface relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_30px_80px_-30px_rgba(24,20,52,0.55)] sm:p-8">
        {dismissible ? (
          <button
            aria-label="Закрыть"
            className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-full bg-soft text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            type="button"
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        ) : null}
        {children}
      </div>
    </dialog>
  );
}
