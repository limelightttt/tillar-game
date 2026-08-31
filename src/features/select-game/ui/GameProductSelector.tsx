import { Check, Grid2X2Plus, Images } from "lucide-react";

import { type GameProductId, gameProducts } from "@/entities/game-product";

import { cn } from "@/shared/lib";

interface GameProductSelectorProps {
  onChange: (gameId: GameProductId) => void;
  value: GameProductId;
}

const productIcons = {
  "two-pictures": Images,
  "four-pictures-word": Grid2X2Plus,
} as const satisfies Record<GameProductId, typeof Images>;

export function GameProductSelector({ onChange, value }: GameProductSelectorProps) {
  return (
    <section aria-labelledby="game-product-title" className="mb-5">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
            TILLAR Games
          </p>
          <h1
            className="mt-0.5 text-xl font-black tracking-[-0.04em] text-foreground sm:text-2xl"
            id="game-product-title"
          >
            Выбери игру
          </h1>
        </div>
        <p className="text-xs font-bold text-muted">Обе игры работают в одной платформе</p>
      </div>

      <div aria-label="Игровой продукт" className="grid gap-2.5 sm:grid-cols-2" role="group">
        {gameProducts.map((product) => {
          const selected = value === product.id;
          const Icon = productIcons[product.id];

          return (
            <button
              aria-pressed={selected}
              className={cn(
                "group flex min-h-[5.5rem] items-center gap-3 rounded-[1.45rem] border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:p-4",
                selected
                  ? "border-primary/65 bg-ink text-white shadow-[0_16px_35px_-24px_rgba(7,31,61,0.9)]"
                  : "border-white/80 bg-white/88 text-foreground shadow-sm hover:border-primary/30 hover:bg-white",
              )}
              key={product.id}
              type="button"
              onClick={() => onChange(product.id)}
            >
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-2xl",
                  selected ? "bg-primary text-white" : "bg-primary-soft text-primary",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "text-[0.62rem] font-black uppercase tracking-[0.12em]",
                    selected ? "text-cyan" : "text-primary",
                  )}
                >
                  Игра {product.code}
                </span>
                <span className="mt-0.5 block font-black tracking-[-0.025em]">{product.title}</span>
                <span
                  className={cn("mt-0.5 block text-xs", selected ? "text-white/58" : "text-muted")}
                >
                  {product.shortTitle}
                </span>
              </span>
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border",
                  selected
                    ? "border-cyan bg-cyan text-ink"
                    : "border-line bg-white text-transparent",
                )}
              >
                <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
