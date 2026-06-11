import { cn } from "@/lib/format";

export const FHENIX_URL = "https://fhenix.io";

const FHENIX_LOGO_SRC =
  "https://cdn.prod.website-files.com/6864e9aed9e0a3fac7810db8/68a473dd63e0265d2d6cf9a3_(fhenix_)%20(16).svg";

export function FhenixLogo({ className }: { className?: string }) {
  return (
    <a
      href={FHENIX_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Fhenix"
      className={cn(
        "inline-flex items-center no-underline transition-opacity hover:opacity-80",
        className
      )}
    >
      <img
        src={FHENIX_LOGO_SRC}
        alt="Fhenix"
        className="h-[1.15em] w-auto dark:invert"
        loading="lazy"
      />
    </a>
  );
}
