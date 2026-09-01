import { cn } from "@/shared/lib";

interface TillarLogoProps {
  badgeClassName?: string;
  className?: string;
  compact?: boolean;
}

export function TillarLogo({ badgeClassName, className, compact = false }: TillarLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)} aria-label="TILLAR Games">
      <span className="text-3xl font-black italic leading-none tracking-[-0.075em] text-current">
        tillar
      </span>
      {compact ? null : (
        <span
          className={cn(
            "rounded-full border border-current/20 px-2 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em] text-current/65",
            badgeClassName,
          )}
        >
          Games
        </span>
      )}
    </div>
  );
}
