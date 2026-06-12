"use client";

import { GetTestEthButton } from "@/components/get-test-eth-button";
import { cn } from "@/lib/format";

type TestnetSetupNoticeProps = {
  className?: string;
};

export function TestnetSetupNotice({ className }: TestnetSetupNoticeProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-sm", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-2xl bg-accent-400/35 blur-2xl animate-pulse-glow dark:bg-accent-400/20"
      />

      <div className="testnet-notice-beam">
        <div aria-hidden="true" className="testnet-notice-beam__spinner" />

        <div className="testnet-notice-beam__inner px-5 py-4 text-center">
          <span className="inline-flex items-center rounded-full border border-accent-400/45 bg-accent-400/15 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-brand-800 shadow-[0_0_14px_-3px_rgba(34,211,238,0.55)] dark:border-accent-400/35 dark:bg-accent-400/12 dark:text-accent-200 dark:shadow-[0_0_16px_-4px_rgba(34,211,238,0.4)]">
            Step 1 · Get test ETH (free)
          </span>

          <GetTestEthButton size="md" emphasized className="mt-3.5" />

          <p className="mt-4 text-[0.7rem] leading-relaxed text-ink-600 dark:text-white/45">
            <span className="font-semibold text-ink-800 dark:text-white/55">
              Step 2
            </span>{" "}
            — Connect your wallet below to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
