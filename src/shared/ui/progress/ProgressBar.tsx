import { cn } from "@/shared/lib";

interface ProgressBarProps {
  className?: string;
  label: string;
  tone?: "primary" | "success" | "danger";
  value: number;
}

const toneClassNames = {
  danger: "bg-danger",
  primary: "bg-primary",
  success: "bg-success",
} as const;

export function ProgressBar({ className, label, tone = "primary", value }: ProgressBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      className={cn("h-2.5 overflow-hidden rounded-full bg-line/70", className)}
      role="progressbar"
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", toneClassNames[tone])}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}
