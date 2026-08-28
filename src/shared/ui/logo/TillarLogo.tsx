import { cn } from "@/shared/lib";

interface TillarLogoProps {
  className?: string;
  compact?: boolean;
}

export function TillarLogo({ className, compact = false }: TillarLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)} aria-label="TILLAR Games">
      <span className="grid size-10 rotate-[-7deg] place-items-center rounded-[0.9rem] bg-ink text-lg font-black text-white shadow-[0_8px_20px_-10px_rgba(24,20,52,0.8)]">
        t
      </span>
      {compact ? null : (
        <span className="flex flex-col leading-none">
          <span className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-muted">
            Tillar
          </span>
          <span className="text-lg font-black tracking-[-0.04em] text-foreground">Games</span>
        </span>
      )}
    </div>
  );
}
