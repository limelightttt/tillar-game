import { type ButtonHTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold tracking-[-0.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-45 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-[0_12px_24px_-12px_rgba(100,68,221,0.9)] hover:bg-primary-strong",
        secondary: "border border-line bg-white text-foreground shadow-sm hover:bg-soft",
        ghost: "text-muted hover:bg-soft hover:text-foreground",
        danger: "bg-danger text-white hover:bg-danger/90",
      },
      size: {
        default: "min-h-12 px-5",
        large: "min-h-14 rounded-[1.125rem] px-7 text-base",
        icon: "size-12 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({
  className,
  fullWidth,
  size,
  type = "button",
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ className, fullWidth, size, variant }))}
      type={type}
      {...props}
    />
  );
}
