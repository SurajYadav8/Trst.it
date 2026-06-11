"use client";

import { useCallback, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { TestnetEthNotice } from "@/components/testnet-eth-notice";
import { ACTIVE_CHAIN } from "@/lib/constants";
import {
  getTestnetFaucetUrl,
  hasSufficientTestnetBalance,
} from "@/lib/testnet-balance";

type GuardOptions = {
  /** When false, skip the balance check (e.g. off-chain-only flows). */
  requiresOnchain?: boolean;
};

export function useOnchainActionGuard() {
  const { address } = useAccount();
  const { refetch } = useBalance({
    address,
    chainId: ACTIVE_CHAIN.id,
  });
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [balanceWei, setBalanceWei] = useState<bigint | undefined>();

  const closeNotice = useCallback(() => setNoticeOpen(false), []);

  const openNoticeWithBalance = useCallback(async () => {
    const { data } = await refetch();
    setBalanceWei(data?.value);
    setNoticeOpen(true);
  }, [refetch]);

  const guardAction = useCallback(
    async (
      action: () => void | Promise<void>,
      options: GuardOptions = { requiresOnchain: true }
    ) => {
      if (options.requiresOnchain === false) {
        await action();
        return;
      }
      if (!address) return;

      const { data } = await refetch();
      setBalanceWei(data?.value);
      if (!hasSufficientTestnetBalance(data?.value)) {
        setNoticeOpen(true);
        return;
      }

      await action();
    },
    [address, refetch]
  );

  const notice = (
    <TestnetEthNotice
      open={noticeOpen}
      onClose={closeNotice}
      chainName={ACTIVE_CHAIN.name}
      faucetUrl={getTestnetFaucetUrl(ACTIVE_CHAIN.id)}
      balanceWei={balanceWei}
    />
  );

  return {
    guardAction,
    showNotice: openNoticeWithBalance,
    closeNotice,
    notice,
  };
}
