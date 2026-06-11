"use client";

import { GetTestEthButton } from "@/components/get-test-eth-button";
import { ACTIVE_CHAIN } from "@/lib/constants";
import { cn } from "@/lib/format";

type TestnetSetupNoticeProps = {
  className?: string;
};

export function TestnetSetupNotice({ className }: TestnetSetupNoticeProps) {
  const chainName = ACTIVE_CHAIN.name;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-xs rounded-lg border border-accent-400/15 bg-accent-400/[0.04] px-4 py-3 text-center dark:border-accent-400/12 dark:bg-accent-400/[0.05]",
        className
      )}
    >
      <GetTestEthButton size="sm" className="mb-3" />

      <p className="text-xs leading-snug text-ink-500 dark:text-white/45">
        Requires {chainName} ETH
        <br />
        for encryption and verification transactions.
      </p>
    </div>
  );
}
