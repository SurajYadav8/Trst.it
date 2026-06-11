import { formatEther, parseEther } from "viem";
import { arbitrumSepolia, sepolia } from "viem/chains";

/** Minimum balance to attempt an on-chain transaction without a heads-up. */
export const MIN_TESTNET_ETH_WEI = parseEther("0.0001");

const FAUCET_URLS: Record<number, string> = {
  [arbitrumSepolia.id]: "https://www.alchemy.com/faucets/arbitrum-sepolia",
  [sepolia.id]: "https://www.alchemy.com/faucets/ethereum-sepolia",
};

export function getTestnetFaucetUrl(chainId: number): string {
  return (
    FAUCET_URLS[chainId] ??
    "https://www.alchemy.com/faucets/arbitrum-sepolia"
  );
}

export function hasSufficientTestnetBalance(
  balance: bigint | undefined
): boolean {
  if (balance === undefined) return true;
  return balance >= MIN_TESTNET_ETH_WEI;
}

export function formatTestnetBalance(balance: bigint | undefined): string | null {
  if (balance === undefined) return null;
  const eth = Number(formatEther(balance));
  if (!Number.isFinite(eth)) return "0.0000";
  return eth.toFixed(4);
}

export function isInsufficientFundsError(err: unknown): boolean {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "object" && err && "message" in err
        ? String((err as { message: unknown }).message)
        : String(err);
  const lower = raw.toLowerCase();
  return (
    lower.includes("insufficient funds") ||
    lower.includes("insufficient balance") ||
    lower.includes("not enough funds") ||
    lower.includes("exceeds balance")
  );
}
