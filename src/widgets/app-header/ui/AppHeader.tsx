import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useI18n } from "@/shared/config";
import { LanguageSelector, TillarLogo } from "@/shared/ui";

interface AppHeaderProps {
  backLabel?: string;
  eyebrow?: string;
  onBack?: () => void;
  title?: string;
}

export function AppHeader({ backLabel, eyebrow, onBack, title }: AppHeaderProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const hasBackAction = Boolean(onBack);

  return (
    <header className="tillar-header mx-auto mb-5 flex w-full max-w-6xl items-center justify-between gap-3 rounded-b-[2rem] px-4 py-5 text-white sm:mb-6 sm:rounded-b-[2.4rem] sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {hasBackAction ? (
          <button
            aria-label={backLabel ?? t("common.back")}
            className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur transition hover:bg-white/18 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan/30"
            type="button"
            onClick={onBack}
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </button>
        ) : (
          <button
            aria-label={t("common.home")}
            className="min-h-11 rounded-xl text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan/30"
            type="button"
            onClick={() => navigate("/")}
          >
            <TillarLogo />
          </button>
        )}

        {title ? (
          <div className="min-w-0">
            {eyebrow ? (
              <p className="truncate text-[0.65rem] font-black uppercase tracking-[0.2em] text-cyan">
                {eyebrow}
              </p>
            ) : null}
            <p className="truncate text-base font-black tracking-[-0.025em] text-white sm:text-lg">
              {title}
            </p>
          </div>
        ) : null}
      </div>

      <LanguageSelector />
    </header>
  );
}
