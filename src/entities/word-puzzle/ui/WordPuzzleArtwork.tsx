import {
  Activity,
  Armchair,
  Atom,
  AudioLines,
  Binary,
  BookOpen,
  Bot,
  Brain,
  Cable,
  CalendarDays,
  Camera,
  Castle,
  CircleDot,
  Clapperboard,
  Code2,
  Coins,
  CookingPot,
  Cpu,
  Crown,
  Drum,
  Earth,
  Feather,
  Film,
  Fish,
  Flag,
  FlaskConical,
  Flower2,
  Footprints,
  Frame,
  Goal,
  Hand,
  Headphones,
  Landmark,
  Laptop,
  Lightbulb,
  ListChecks,
  type LucideIcon,
  MapPin,
  Medal,
  Mic2,
  Microscope,
  MonitorPlay,
  Mountain,
  Music2,
  Network,
  NotebookText,
  Orbit,
  Palette,
  PanelsTopLeft,
  Pencil,
  PersonStanding,
  Piano,
  Rocket,
  Ruler,
  ScrollText,
  Settings,
  Shapes,
  Ship,
  Snowflake,
  Sparkles,
  SquareStack,
  Telescope,
  Timer,
  TreePalm,
  UserRound,
  Waves,
  Wheat,
  Zap,
} from "lucide-react";

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

const artworkIcons: Record<string, LucideIcon> = {
  "algorithm-code": Code2,
  "algorithm-flowchart": Network,
  "algorithm-machine": Settings,
  "algorithm-recipe": ListChecks,
  "atom-energy": Zap,
  "atom-lab": FlaskConical,
  "atom-microscope": Microscope,
  "atom-model": Atom,
  "chronicle-dates": CalendarDays,
  "chronicle-manuscript": ScrollText,
  "chronicle-quill": Feather,
  "chronicle-scribe": BookOpen,
  "crown-castle": Castle,
  "crown-gold": Coins,
  "crown-king": Crown,
  "crown-throne": Armchair,
  "frame-camera": Camera,
  "frame-clapper": Clapperboard,
  "frame-film": Film,
  "frame-screen": MonitorPlay,
  "gagarin-date": CalendarDays,
  "gagarin-orbit": Orbit,
  "gagarin-portrait": UserRound,
  "gagarin-vostok": Rocket,
  "genius-books": BookOpen,
  "genius-formula": Binary,
  "genius-idea": Lightbulb,
  "genius-scientist": Brain,
  "marathon-distance": Ruler,
  "marathon-finish": Flag,
  "marathon-medal": Medal,
  "marathon-runners": Footprints,
  "melody-listener": Headphones,
  "melody-notes": Music2,
  "melody-piano": Piano,
  "melody-singer": Mic2,
  "mosaic-floor": SquareStack,
  "mosaic-hands": Hand,
  "mosaic-tiles": Shapes,
  "mosaic-wall": Landmark,
  "mountain-cable": Cable,
  "mountain-climber": PersonStanding,
  "mountain-peak": Mountain,
  "mountain-snow": Snowflake,
  "ocean-fish": Fish,
  "ocean-island": TreePalm,
  "ocean-ship": Ship,
  "ocean-wave": Waves,
  "planet-earth": Earth,
  "planet-ring": CircleDot,
  "planet-rocket": Rocket,
  "planet-telescope": Telescope,
  "portrait-face": UserRound,
  "portrait-frame": Frame,
  "portrait-palette": Palette,
  "portrait-pencil": Pencil,
  "racket-badminton": Activity,
  "racket-net": Goal,
  "racket-player": PersonStanding,
  "racket-tennis": CircleDot,
  "registan-dome": Landmark,
  "registan-mosaic": Shapes,
  "registan-samarkand": MapPin,
  "registan-square": Landmark,
  "rhythm-dance": Activity,
  "rhythm-drum": Drum,
  "rhythm-metronome": Timer,
  "rhythm-notes": AudioLines,
  "robot-arm": Activity,
  "robot-circuit": Cpu,
  "robot-face": Bot,
  "robot-gear": Settings,
  "screenplay-clapper": Clapperboard,
  "screenplay-pages": NotebookText,
  "screenplay-storyboard": PanelsTopLeft,
  "screenplay-writer": Laptop,
  "sumalak-cauldron": CookingPot,
  "sumalak-navruz": Flower2,
  "sumalak-stirring": Sparkles,
  "sumalak-wheat": Wheat,
};

export function WordPuzzleArtwork({ className = "", image, index }: WordPuzzleArtworkProps) {
  const themeKey = image.visualKey.split("-")[0] as keyof typeof artworkThemes;
  const theme = artworkThemes[themeKey] ?? fallbackTheme;
  const Icon = artworkIcons[image.visualKey] ?? Shapes;

  return (
    <figure
      aria-label={`Подсказка ${index + 1}: ${image.alt}`}
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
          <span className="grid size-[64%] min-h-16 min-w-16 place-items-center rounded-[30%] border border-white/80 bg-white/72 text-foreground shadow-[0_20px_40px_-25px_rgba(28,25,48,0.5)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.04]">
            <Icon className="size-[48%]" strokeWidth={1.55} />
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
