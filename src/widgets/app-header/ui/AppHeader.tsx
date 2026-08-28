import { type ReactNode } from "react";

import { ArrowLeft, CircleHelp } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/shared/lib";
import { TillarLogo } from "@/shared/ui";

interface AppHeaderProps {
  backLabel?: string;
  eyebrow?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  title?: string;
}

export function AppHeader({
  backLabel = "Назад",
  eyebrow,
  onBack,
  rightSlot,
  title,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const hasBackAction = Boolean(onBack);

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {hasBackAction ? (
          <button
            aria-label={backLabel}
            className="grid size-11 shrink-0 place-items-center rounded-2xl border border-line bg-white text-foreground shadow-sm transition hover:bg-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            type="button"
            onClick={onBack}
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </button>
        ) : (
          <button
            aria-label="На главную"
            className="min-h-11 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            type="button"
            onClick={() => navigate("/")}
          >
            <TillarLogo />
          </button>
        )}

        {title ? (
          <div className="min-w-0">
            {eyebrow ? (
              <p className="truncate text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <p className="truncate text-base font-black tracking-[-0.025em] text-foreground sm:text-lg">
              {title}
            </p>
          </div>
        ) : null}
      </div>

      <div className={cn("flex shrink-0 items-center gap-2", !rightSlot && "hidden sm:flex")}>
        {rightSlot ?? (
          <div className="flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-2 pr-3 text-xs font-bold text-muted shadow-sm">
            <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-primary">
              <CircleHelp aria-hidden="true" className="size-4" />
            </span>
            2 игры
          </div>
        )}
      </div>
    </header>
  );
}
