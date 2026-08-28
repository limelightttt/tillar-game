import { Brain, Images, Infinity as InfinityIcon } from "lucide-react";

import { RobotSequence } from "@/shared/ui/robot-sequence";

const features = [
  { icon: Images, text: "2 картинки" },
  { icon: Brain, text: "факт после ответа" },
  { icon: InfinityIcon, text: "без уровней" },
] as const;

export function GameIntro() {
  return (
    <section className="relative isolate min-h-[34rem] overflow-hidden rounded-[2.25rem] bg-ink px-6 pb-4 pt-7 text-white shadow-[0_28px_80px_-34px_rgba(24,20,52,0.72)] sm:px-9 sm:pt-9 lg:min-h-[42rem]">
      <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/45 blur-3xl" />
      <div className="relative z-10">
        <p className="mb-6 text-xs font-black uppercase tracking-[0.14em] text-white/75">
          Игра 01 · Две картинки
        </p>
        <h1 className="max-w-xl text-[clamp(2.5rem,7vw,5rem)] font-black leading-[0.94] tracking-[-0.065em]">
          Выбирай.
          <br />
          <span className="text-cyan">Узнавай.</span>
          <br />
          Запоминай.
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/62 sm:text-lg">
          Один вопрос, две иллюстрации и короткий факт, который останется с тобой.
        </p>
        <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Особенности игры">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 text-xs font-bold text-white/72"
                key={feature.text}
              >
                <Icon aria-hidden="true" className="size-3.5 text-cyan" />
                {feature.text}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="pointer-events-none absolute bottom-[-3rem] right-[-2rem] z-10 w-[min(62%,22rem)] sm:bottom-[-4rem] sm:right-1 lg:w-[24rem]">
        <RobotSequence
          decorative
          className="drop-shadow-[0_24px_32px_rgba(0,0,0,0.36)]"
          variant="idle"
        />
      </div>
    </section>
  );
}
