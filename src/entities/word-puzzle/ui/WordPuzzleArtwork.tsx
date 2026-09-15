import { useI18n } from "@/shared/config";

import type { WordPuzzleImage } from "../model/types";

interface WordPuzzleArtworkProps {
  className?: string;
  image: WordPuzzleImage;
  index: number;
}

const artworkThemes = {
  atom: {
    background: "from-cyan-100 via-white to-violet-100",
    accent: "bg-cyan-400/25",
    ink: "text-cyan-950",
  },
  crown: {
    background: "from-amber-100 via-white to-purple-100",
    accent: "bg-amber-400/30",
    ink: "text-amber-950",
  },
  frame: {
    background: "from-rose-100 via-white to-orange-100",
    accent: "bg-rose-400/25",
    ink: "text-rose-950",
  },
  genius: {
    background: "from-yellow-100 via-white to-cyan-100",
    accent: "bg-yellow-400/30",
    ink: "text-yellow-950",
  },
  mountain: {
    background: "from-indigo-100 via-white to-sky-100",
    accent: "bg-indigo-400/25",
    ink: "text-indigo-950",
  },
  ocean: {
    background: "from-cyan-100 via-white to-blue-100",
    accent: "bg-cyan-400/25",
    ink: "text-cyan-950",
  },
  planet: {
    background: "from-violet-100 via-white to-indigo-100",
    accent: "bg-violet-400/25",
    ink: "text-violet-950",
  },
  portrait: {
    background: "from-orange-100 via-white to-rose-100",
    accent: "bg-orange-400/25",
    ink: "text-orange-950",
  },
  racket: {
    background: "from-emerald-100 via-white to-lime-100",
    accent: "bg-emerald-400/25",
    ink: "text-emerald-950",
  },
  registan: {
    background: "from-sky-100 via-white to-amber-100",
    accent: "bg-sky-400/25",
    ink: "text-sky-950",
  },
  rhythm: {
    background: "from-fuchsia-100 via-white to-violet-100",
    accent: "bg-fuchsia-400/25",
    ink: "text-fuchsia-950",
  },
  robot: {
    background: "from-violet-100 via-white to-cyan-100",
    accent: "bg-violet-400/25",
    ink: "text-violet-950",
  },
} as const;

const fallbackTheme = {
  background: "from-primary-soft via-white to-cyan-soft",
  accent: "bg-primary/20",
  ink: "text-foreground",
} as const;

export function WordPuzzleArtwork({ className = "", image, index }: WordPuzzleArtworkProps) {
  const { t } = useI18n();
  const themeKey = image.visualKey.split("-")[0] as keyof typeof artworkThemes;
  const theme = artworkThemes[themeKey] ?? fallbackTheme;

  return (
    <figure
      aria-label={t("board.clue", { label: image.alt, number: index + 1 })}
      className={`group relative isolate aspect-square overflow-hidden rounded-[1.35rem] border border-white/80 bg-gradient-to-br ${theme.background} ${className}`}
      role="img"
    >
      <span
        aria-hidden="true"
        className={`absolute -right-[18%] -top-[18%] size-[72%] rounded-full blur-2xl ${theme.accent}`}
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-[24%] -left-[18%] size-[68%] rounded-full bg-white/75 blur-2xl"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(currentColor 0.7px, transparent 0.7px)",
          backgroundSize: "9px 9px",
        }}
      />

      <span className="relative grid h-full place-items-center p-4" aria-hidden="true">
        {image.src ? (
          <img
            alt=""
            className="h-full w-full rounded-[1rem] object-cover shadow-[0_20px_40px_-25px_rgba(28,25,48,0.5)] transition-transform duration-300 group-hover:scale-[1.02]"
            decoding="async"
            loading="eager"
            src={image.src}
          />
        ) : (
          <span className="grid size-[64%] min-h-16 min-w-16 place-items-center rounded-[30%] border border-white/80 bg-white/72 text-[clamp(2.4rem,11vw,5.25rem)] shadow-[0_20px_40px_-25px_rgba(28,25,48,0.5)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.04] lg:text-6xl">
            {image.symbol ?? "✦"}
          </span>
        )}
      </span>

      <figcaption
        className={`absolute bottom-2.5 left-2.5 rounded-full border border-white/75 bg-white/82 px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.11em] shadow-sm backdrop-blur ${theme.ink}`}
      >
        {String(index + 1).padStart(2, "0")}
      </figcaption>
    </figure>
  );
}
