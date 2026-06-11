"use client";

import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { FhenixLogo } from "@/components/fhenix-logo";

export function Footer() {
  const pathname = usePathname() ?? "/";

  // The landing route is a full-screen, self-contained experience.
  if (pathname === "/") return null;

  return (
    <footer className="border-t border-ink-200 bg-white dark:border-white/10 dark:bg-night-900/80 dark:backdrop-blur">
      <Container className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-500 dark:text-white/45">
        <div>
          &copy; {new Date().getFullYear()} Trst.it &middot; Confidential
          rental screening
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            Powered by <FhenixLogo />
          </span>
        </div>
      </Container>
    </footer>
  );
}
