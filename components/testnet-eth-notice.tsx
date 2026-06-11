"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/format";
import {
  formatTestnetBalance,
  hasSufficientTestnetBalance,
} from "@/lib/testnet-balance";

type TestnetEthNoticeProps = {
  open: boolean;
  onClose: () => void;
  chainName: string;
  faucetUrl: string;
  balanceWei?: bigint;
  className?: string;
};

export function TestnetEthNotice({
  open,
  onClose,
  chainName,
  faucetUrl,
  balanceWei,
  className,
}: TestnetEthNoticeProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const formattedBalance = formatTestnetBalance(balanceWei);
  const insufficient =
    balanceWei !== undefined && !hasSufficientTestnetBalance(balanceWei);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center",
        className
      )}
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink-900/35 backdrop-blur-[1px] dark:bg-night-950/55"
        onClick={onClose}
        aria-label="Back"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="testnet-eth-notice-title"
        className="relative w-full max-w-md rounded-lg border border-accent-400/25 bg-white p-5 shadow-glow-sm dark:border-accent-400/20 dark:bg-night-900"
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-accent-400/30 bg-accent-400/10 dark:border-accent-400/25 dark:bg-accent-400/[0.08]">
          <span
            aria-hidden="true"
            className="text-sm text-accent-600 dark:text-accent-300"
          >
            ⚡
          </span>
        </div>

        <h2
          id="testnet-eth-notice-title"
          className="text-base font-semibold text-ink-900 dark:text-white"
        >
          Insufficient {chainName} ETH
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-white/65">
          Your wallet does not currently have enough test ETH to complete this
          transaction.
        </p>

        <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-white/50">
          This action requires a small amount of {chainName} ETH for gas fees.
        </p>

        {formattedBalance !== null ? (
          <div className="mt-4 rounded-md border border-ink-100 bg-ink-50/80 px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/[0.03]">
            <span className="text-ink-500 dark:text-white/45">
              Your balance:{" "}
            </span>
            <span className="font-medium text-ink-900 dark:text-white">
              {formattedBalance} ETH
            </span>
            {insufficient ? (
              <p className="mt-1 text-xs text-accent-600 dark:text-accent-300">
                Insufficient balance detected.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-xs text-accent-600 dark:text-accent-300">
            Insufficient balance detected.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Back
          </Button>
          <Button
            type="button"
            onClick={() =>
              window.open(faucetUrl, "_blank", "noopener,noreferrer")
            }
          >
            Get Test ETH
          </Button>
        </div>
      </div>
    </div>
  );
}
