"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleGuard } from "@/components/role-guard";
import { formatDate } from "@/lib/format";
import { PRIMARY_CARD_CLASS } from "@/lib/ui-classes";
import {
  RECENT_VERIFICATION_LIMIT,
  VerificationHistoryHeader,
  VerificationJourneyProgress,
  VerificationResultsGrid,
  ViewAllVerificationsLink,
  buildJourneySteps,
  type VerificationResult,
} from "@/components/tenant/verification-ui";
import { VerifyLinkModal } from "@/components/tenant/verify-link-modal";

export default function DashboardPage() {
  return (
    <RoleGuard role="tenant">
      <TenantDashboard />
    </RoleGuard>
  );
}

const PROFILE_ATTRIBUTES = [
  "Salary",
  "Credit Score",
  "Employment Duration",
] as const;

function TenantDashboard() {
  const { address } = useAccount();
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const profile = useQuery(
    api.profiles.get,
    address ? { walletAddress: address.toLowerCase() } : "skip"
  );
  const results = useQuery(
    api.results.listForTenant,
    address ? { tenantAddress: address.toLowerCase() } : "skip"
  );

  const loading = profile === undefined;
  const hasProfile = !!profile;
  const resultItems = (results ?? []) as VerificationResult[];
  const resultCount = resultItems.length;
  const recentResults = resultItems.slice(0, RECENT_VERIFICATION_LIMIT);
  const journeySteps = buildJourneySteps(hasProfile, resultCount);

  if (loading) {
    return (
      <Container className="py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          <div className="space-y-4">
            <div className="h-8 w-48 rounded bg-ink-50 animate-pulse dark:bg-white/[0.04]" />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="h-64 rounded-lg bg-ink-50 animate-pulse dark:bg-white/[0.04]" />
        </div>
      </Container>
    );
  }

  if (!hasProfile) {
    return (
      <Container className="flex min-h-[calc(100dvh-10rem)] flex-col py-8 pb-2">
        <div className="flex-1">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
            <ProfileOnboarding />
            <aside>
              <ProfileStatusCard profile={null} />
            </aside>
          </div>

          {resultCount > 0 ? (
            <section className="mt-8">
              <VerificationHistoryHeader
                onVerifyClick={() => setVerifyModalOpen(true)}
                totalCount={resultCount}
              />
              <VerificationResultsGrid results={recentResults} />
              <ViewAllVerificationsLink totalCount={resultCount} />
            </section>
          ) : null}
        </div>

        <VerificationJourneyProgress
          steps={journeySteps}
          className="mt-auto pt-3"
        />

        <VerifyLinkModal
          open={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
        />
      </Container>
    );
  }

  return (
    <Container className="flex min-h-[calc(100dvh-10rem)] flex-col py-8 pb-2">
      <div className="flex-1">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          <section>
            <VerificationHistoryHeader
              onVerifyClick={() => setVerifyModalOpen(true)}
              totalCount={resultCount}
            />

            {results === undefined ? (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : resultCount === 0 ? (
              <div className="rounded-lg border border-dashed border-accent-400/20 bg-ink-50/40 px-6 py-12 text-center dark:border-accent-400/15 dark:bg-white/[0.02]">
                <h3 className="text-lg font-semibold text-ink-900 dark:text-white">
                  Ready for verification
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500 dark:text-white/50">
                  Your encrypted profile is ready. Use Verify New Request above
                  when a landlord shares a link.
                </p>
              </div>
            ) : (
              <>
                <VerificationResultsGrid results={recentResults} />
                <ViewAllVerificationsLink totalCount={resultCount} />
              </>
            )}
          </section>

          <aside>
            <ProfileStatusCard profile={profile} />
          </aside>
        </div>
      </div>

      <VerificationJourneyProgress
        steps={journeySteps}
        className="mt-auto pt-3"
      />

      <VerifyLinkModal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />
    </Container>
  );
}

function ProfileOnboarding() {
  return (
    <Card className={`overflow-hidden ${PRIMARY_CARD_CLASS}`}>
      <CardBody className="px-6 py-12 sm:px-10 sm:py-14 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-accent-400/30 bg-accent-400/10 dark:border-accent-400/25 dark:bg-accent-400/[0.08]">
          <LockIcon className="h-5 w-5 text-accent-600 dark:text-accent-300" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white sm:text-3xl">
          Create Your Encrypted Profile
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-600 dark:text-white/60">
          Store your information privately and verify eligibility without
          revealing sensitive data. Only verification results are shared.
        </p>

        <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left">
          {PROFILE_ATTRIBUTES.map((label) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-lg border border-ink-200 bg-ink-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-400/15 text-accent-600 dark:bg-accent-400/10 dark:text-accent-300">
                <LockIcon className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-medium text-ink-800 dark:text-white/85">
                {label}
              </span>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-ink-500 dark:text-white/45">
          Encrypted using Fhenix coFHE. Only pass/fail eligibility results are
          revealed. Never raw values.
        </p>

        <div className="mt-8">
          <Link href="/profile">
            <Button size="lg" className="min-w-[240px]">
              Create Encrypted Profile
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

function ProfileStatusCard({
  profile,
}: {
  profile: {
    updatedAt: number;
    onChainTxHash?: string;
  } | null;
}) {
  const attributeCount = profile ? PROFILE_ATTRIBUTES.length : 0;

  return (
    <Card className="border-ink-200/80 dark:border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Encrypted Profile</CardTitle>
        {profile === null ? (
          <CardDescription>
            Create your profile to begin verifying.
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardBody className="pt-2">
        {profile === null ? (
          <>
            <Badge tone="warn" className="mb-3">
              Not Created
            </Badge>
            <p className="text-sm text-ink-600 mb-4 dark:text-white/60">
              Create your profile to begin verifying against landlord
              requirements.
            </p>
            <Link href="/profile">
              <Button size="sm">Create Encrypted Profile</Button>
            </Link>
          </>
        ) : (
          <>
            <Badge tone="success" className="mb-3">
              Encrypted &amp; Saved
            </Badge>

            <p className="mb-3 text-xs text-ink-500 dark:text-white/45">
              {attributeCount} / {PROFILE_ATTRIBUTES.length} attributes added
            </p>

            <ul className="mb-4 space-y-1.5">
              {PROFILE_ATTRIBUTES.map((label) => (
                <li
                  key={label}
                  className="flex items-center justify-between text-sm text-ink-700 dark:text-white/70"
                >
                  <span>{label}</span>
                  <span className="text-accent-600 dark:text-accent-300">✓</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-ink-500 mb-4 dark:text-white/45">
              Last updated {formatDate(profile.updatedAt)}
            </p>

            <Link href="/profile">
              <Button size="sm" variant="secondary">
                Edit Profile
              </Button>
            </Link>
          </>
        )}
      </CardBody>
    </Card>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="h-36 rounded-lg border border-ink-100 bg-ink-50 animate-pulse dark:border-white/8 dark:bg-white/[0.04]" />
  );
}
