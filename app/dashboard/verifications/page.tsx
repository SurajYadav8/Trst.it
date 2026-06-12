"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Container, PageHeading } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { RoleGuard } from "@/components/role-guard";
import {
  VerificationHistoryHeader,
  VerificationResultsGrid,
  type VerificationResult,
} from "@/components/tenant/verification-ui";
import { useState } from "react";
import { VerifyLinkModal } from "@/components/tenant/verify-link-modal";

export default function VerificationsPage() {
  return (
    <RoleGuard role="tenant">
      <AllVerifications />
    </RoleGuard>
  );
}

function AllVerifications() {
  const { address } = useAccount();
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const results = useQuery(
    api.results.listForTenant,
    address ? { tenantAddress: address.toLowerCase() } : "skip"
  );

  const loading = results === undefined;
  const items = (results ?? []) as VerificationResult[];

  return (
    <Container className="py-10">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-ink-500 transition-colors hover:text-ink-800 dark:text-white/45 dark:hover:text-white"
        >
          ← Back to dashboard
        </Link>
      </div>

      <PageHeading
        title="All Verifications"
        description="Every verification outcome linked to your wallet."
      />

      <VerificationHistoryHeader
        onVerifyClick={() => setVerifyModalOpen(true)}
        totalCount={items.length}
      />

      {loading ? (
        <div className="space-y-4">
          <div className="h-36 rounded-lg bg-ink-50 animate-pulse dark:bg-white/[0.04]" />
          <div className="h-36 rounded-lg bg-ink-50 animate-pulse dark:bg-white/[0.04]" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-accent-400/20 bg-ink-50/40 px-6 py-14 text-center dark:border-accent-400/15 dark:bg-white/[0.02]">
          <h3 className="text-lg font-semibold text-ink-900 dark:text-white">
            No verifications yet
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500 dark:text-white/50">
            Paste a landlord&apos;s verification link to run your first check.
          </p>
          <Button
            className="mt-6"
            onClick={() => setVerifyModalOpen(true)}
          >
            Verify New Request
          </Button>
        </div>
      ) : (
        <VerificationResultsGrid results={items} />
      )}

      <VerifyLinkModal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />
    </Container>
  );
}
