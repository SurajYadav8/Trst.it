import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  // Resolves to a deep Fhenix navy (#001623) with glow + lift on hover.
  primary:
    "bg-ink-900 text-white border-ink-900 hover:bg-[#001623] hover:border-[#001623] hover:text-white hover:shadow-glow hover:-translate-y-px disabled:bg-ink-300 disabled:border-ink-300 disabled:shadow-none disabled:translate-y-0 dark:bg-white dark:text-night-950 dark:border-white dark:hover:bg-[#001623] dark:hover:border-[#001623] dark:hover:text-white dark:disabled:bg-white/30 dark:disabled:border-white/30",
  secondary:
    "bg-white text-ink-800 border-ink-200 hover:bg-[#001623] hover:border-[#001623] hover:text-white hover:shadow-glow hover:-translate-y-px disabled:text-ink-400 dark:bg-white/[0.05] dark:text-white/85 dark:border-white/12 dark:hover:border-[#001623] dark:hover:bg-[#001623] dark:hover:text-white dark:disabled:text-white/30",
  ghost:
    "bg-transparent text-ink-700 border-transparent hover:bg-[#001623] hover:border-[#001623] hover:text-white disabled:text-ink-400 dark:text-white/70 dark:hover:bg-[#001623] dark:hover:border-[#001623] dark:hover:text-white dark:disabled:text-white/30",
  danger:
    "bg-danger-500 text-white border-danger-500 hover:bg-danger-700 hover:-translate-y-px disabled:bg-danger-500/40 disabled:translate-y-0",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading,
      className,
      children,
      disabled,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-night-950 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
