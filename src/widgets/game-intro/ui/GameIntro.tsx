import {
  Brain,
  Grid2X2Plus,
  Images,
  Infinity as InfinityIcon,
  LetterText,
  Lightbulb,
} from "lucide-react";
import type { ReactNode } from "react";

import { type GameProductId } from "@/entities/game-product";

import { RobotSequence } from "@/shared/ui/robot-sequence";

const introContent = {
  "two-pictures": {
    code: "01",
    eyebrow: "Две картинки",
    headline: (
      <>
        Выбирай.
        <br />
        <span className="text-cyan">Узнавай.</span>
        <br />
        Запоминай.
      </>
    ),
    description: "Один вопрос, две иллюстрации и короткий факт, который останется с тобой.",
    features: [
      { icon: Images, text: "2 картинки" },
      { icon: Brain, text: "факт после ответа" },
      { icon: InfinityIcon, text: "без уровней" },
    ],
  },
  "four-pictures-word": {
    code: "02",
    eyebrow: "Четыре картинки / слово",
    headline: (
      <>
        Замечай.
        <br />
        <span className="text-cyan">Собирай.</span>
        <br />
        Открывай.
      </>
    ),
    description: "Четыре визуальные подсказки ведут к одному слову — собери его из букв.",
    features: [
      { icon: Grid2X2Plus, text: "4 подсказки" },
      { icon: LetterText, text: "собери слово" },
      { icon: Lightbulb, text: "объяснение ответа" },
    ],
  },
} as const satisfies Record<
  GameProductId,
  {
    code: string;
    description: string;
    eyebrow: string;
    features: readonly { icon: typeof Images; text: string }[];
    headline: ReactNode;
  }
>;

interface GameIntroProps {
  gameId: GameProductId;
}

export function GameIntro({ gameId }: GameIntroProps) {
  const content = introContent[gameId];

  return (
    <section className="tillar-header relative isolate min-h-[38rem] overflow-hidden rounded-[2.25rem] p-6 text-white shadow-[0_28px_80px_-34px_rgba(7,31,61,0.72)] sm:min-h-[42rem] sm:p-9">
      <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-cyan/20 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(white 0.8px, transparent 0.8px)",
          backgroundSize: "11px 11px",
        }}
      />

      <div
        className="animate-content-swap relative z-10 flex min-h-[34rem] flex-col sm:min-h-[37.5rem]"
        key={gameId}
      >
        <div>
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/75 backdrop-blur">
            <span className="size-2 shrink-0 rounded-full bg-cyan shadow-[0_0_16px_rgba(18,203,228,0.9)]" />
            <span className="truncate">{content.eyebrow}</span>
          </div>

          <h1 className="text-balance max-w-xl text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.94] tracking-[-0.06em]">
            {content.headline}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/62 sm:text-lg">
            {content.description}
          </p>

          <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Особенности игры">
            {content.features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 text-xs font-bold text-white/72 backdrop-blur"
                  key={feature.text}
                >
                  <Icon aria-hidden="true" className="size-3.5 text-cyan" />
                  {feature.text}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative mt-8 min-h-56 flex-1 sm:min-h-64">
          <div className="absolute bottom-1 left-0 h-8 w-40 rounded-[50%] bg-black/40 blur-xl sm:left-2 sm:w-48" />
          <div className="pointer-events-none absolute -left-2 bottom-0 w-48 sm:w-60">
            <RobotSequence
              decorative
              className="drop-shadow-[0_24px_32px_rgba(0,0,0,0.36)]"
              variant="idle"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
