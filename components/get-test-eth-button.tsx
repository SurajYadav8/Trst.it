"use client";

import { ACTIVE_CHAIN } from "@/lib/constants";
import { getTestnetFaucetUrl } from "@/lib/testnet-balance";
import { cn } from "@/lib/format";

type GetTestEthButtonProps = {
  className?: string;
  size?: "sm" | "md";
  /** Show a styled info panel on hover (landing header). */
  showHoverInfo?: boolean;
};

export function GetTestEthButton({
  className,
  size = "sm",
  showHoverInfo = false,
}: GetTestEthButtonProps) {
  const faucetUrl = getTestnetFaucetUrl(ACTIVE_CHAIN.id);
  const chainName = ACTIVE_CHAIN.name;

  const button = (
    <button
      type="button"
      onClick={() =>
        window.open(faucetUrl, "_blank", "noopener,noreferrer")
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-accent-400/30 bg-accent-400/[0.07] font-medium text-accent-700 backdrop-blur-sm transition-all hover:border-accent-400/50 hover:bg-accent-400/12 hover:shadow-glow-sm dark:border-accent-400/25 dark:bg-accent-400/[0.08] dark:text-accent-200 dark:hover:border-accent-400/40",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        className
      )}
    >
      <span aria-hidden="true" className="text-[0.65rem] leading-none">
        ⚡
      </span>
      Get Test ETH
    </button>
  );

  if (!showHoverInfo) return button;

  return (
    <div className="group relative">
      {button}
      <div
        role="tooltip"
        className={cn(
          "pointer-events-none absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-lg border border-accent-400/20 bg-white px-3 py-2.5 text-left text-[0.7rem] leading-snug text-ink-600 shadow-glow-sm opacity-0 transition-opacity duration-200",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          "dark:border-accent-400/15 dark:bg-night-900 dark:text-white/60"
        )}
      >
        <p>
          Requires {chainName} ETH for encryption and verification
          transactions.
        </p>
      </div>
    </div>
  );
}
