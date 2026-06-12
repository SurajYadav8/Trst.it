"use client";

import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAddress, formatDate } from "@/lib/format";
import { VERIFICATION_ITEM_CARD_CLASS } from "@/lib/ui-classes";
import { cn } from "@/lib/format";

export type VerificationResult = {
  _id: string;
  overallEligible: boolean;
  evaluatedAt: number;
  passSalary: boolean;
  passCredit: boolean;
  passEmployment: boolean;
  request?: {
    title?: string;
    propertyLabel?: string;
    landlordAddress?: string;
  } | null;
};

export type JourneyStepState = "done" | "current" | "pending";

export type JourneyStep = {
  label: string;
  state: JourneyStepState;
};

export const RECENT_VERIFICATION_LIMIT = 2;

export function buildJourneySteps(
  hasProfile: boolean,
  resultCount: number
): JourneyStep[] {
  return [
    { label: "Wallet Connected", state: "done" },
    {
      label: "Profile Created",
      state: hasProfile ? "done" : "current",
    },
    {
      label: "Verification Completed",
      state: resultCount > 0 ? "done" : hasProfile ? "current" : "pending",
    },
  ];
}

export function VerificationHistoryHeader({
  onVerifyClick,
  totalCount,
}: {
  onVerifyClick: () => void;
  totalCount: number;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-ink-900 dark:text-white">
          Verification History
        </h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-white/50">
          {totalCount > 0
            ? "Recent verification outcomes."
            : "Your verification outcomes will appear here."}
        </p>
      </div>
      <Button size="sm" onClick={onVerifyClick} className="shrink-0">
        Verify New Request
      </Button>
    </div>
  );
}

export function VerificationJourneyProgress({
  steps,
  className,
}: {
  steps: JourneyStep[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-[0.65rem] leading-snug text-ink-400 dark:text-white/35",
        className
      )}
    >
      <span className="font-medium uppercase tracking-[0.1em]">
        Verification journey
      </span>
      <span className="mx-1.5 text-ink-300 dark:text-white/20" aria-hidden>
        ·
      </span>
      <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-0.5">
        {steps.map((step, index) => (
          <span key={step.label} className="inline-flex items-center gap-1">
            {index > 0 ? (
              <span className="text-ink-300 dark:text-white/20" aria-hidden>
                →
              </span>
            ) : null}
            <span
              className={cn(
                "inline-flex items-center gap-0.5",
                step.state === "done" &&
                  "text-accent-700 dark:text-accent-300/90",
                step.state === "current" &&
                  "font-medium text-brand-800 dark:text-accent-200",
                step.state === "pending" && "text-ink-400/80 dark:text-white/28"
              )}
            >
              {step.state === "done" ? (
                <span className="text-accent-500" aria-hidden>
                  ✓
                </span>
              ) : null}
              {step.label}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}

export function VerificationResultCard({
  result,
}: {
  result: VerificationResult;
}) {
  const summary = verificationSummary(result);
  const { name, label } = verificationPropertyInfo(result.request);

  return (
    <Card
      className={cn(
        "overflow-hidden !transition-none",
        VERIFICATION_ITEM_CARD_CLASS,
        "bg-white dark:bg-white/[0.03]"
      )}
    >
      <CardBody className="px-5 py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="min-w-0 shrink-0 sm:max-w-[38%]">
            <p className="text-base font-semibold tracking-tight text-ink-900 dark:text-white">
              {name}
            </p>
            {label ? (
              <p className="mt-0.5 text-sm text-ink-600 dark:text-white/60">
                {label}
              </p>
            ) : null}
          </div>

          <p className="flex-1 px-1 text-center text-xs leading-snug text-ink-400 dark:text-white/40">
            {formatDate(result.evaluatedAt)}
          </p>

          <Badge
            tone={result.overallEligible ? "success" : "danger"}
            className="shrink-0"
          >
            {result.overallEligible ? "Eligible" : "Not Eligible"}
          </Badge>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className={`text-sm font-medium ${verificationSummaryClass(result)}`}>
            {summary}
          </p>
          <Link href={`/results/${result._id}`} className="shrink-0">
            <Button size="sm" variant="secondary">
              View Results
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

export function VerificationResultsGrid({
  results,
}: {
  results: VerificationResult[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-1">
      {results.map((result) => (
        <VerificationResultCard key={result._id} result={result} />
      ))}
    </div>
  );
}

export function ViewAllVerificationsLink({
  totalCount,
}: {
  totalCount: number;
}) {
  if (totalCount <= RECENT_VERIFICATION_LIMIT) return null;

  return (
    <div className="mt-4 text-center">
      <Link
        href="/dashboard/verifications"
        className="text-sm font-medium text-brand-700 transition-colors hover:text-brand-800 dark:text-accent-300 dark:hover:text-accent-200"
      >
        View All Verifications ({totalCount})
      </Link>
    </div>
  );
}

function looksLikeUnitIdentifier(value: string): boolean {
  const text = value.trim();
  if (!text) return false;
  if (/^(unit|property|apt|#)\s*/i.test(text)) return true;
  if (/^\d+[a-zA-Z]?$/.test(text)) return true;
  return text.length <= 8 && /\d/.test(text) && !/\s{2,}/.test(text);
}

function formatPropertyIdentifier(value: string): string {
  const text = value.trim();
  if (/^(unit|property|apt|#)\s*/i.test(text)) return text;
  if (/^\d+[a-zA-Z]?$/.test(text)) return `Property ${text}`;
  return text;
}

function verificationPropertyInfo(
  request: VerificationResult["request"]
): { name: string; label: string | null } {
  if (!request) return { name: "Verification", label: null };

  const { title, propertyLabel } = request;

  if (title && propertyLabel) {
    const titleIsUnit = looksLikeUnitIdentifier(title);
    const labelIsUnit = looksLikeUnitIdentifier(propertyLabel);

    if (titleIsUnit && !labelIsUnit) {
      return {
        name: propertyLabel,
        label: formatPropertyIdentifier(title),
      };
    }

    if (labelIsUnit && !titleIsUnit) {
      return {
        name: title,
        label: formatPropertyIdentifier(propertyLabel),
      };
    }

    return {
      name: title,
      label: formatPropertyIdentifier(propertyLabel),
    };
  }

  const single = title ?? propertyLabel;
  if (!single) return { name: "Verification", label: null };

  if (looksLikeUnitIdentifier(single)) {
    return {
      name: request.landlordAddress
        ? formatAddress(request.landlordAddress)
        : "Verification",
      label: formatPropertyIdentifier(single),
    };
  }

  return { name: single, label: null };
}

function verificationSummary(result: VerificationResult): string {
  const passed = [
    result.passSalary,
    result.passCredit,
    result.passEmployment,
  ].filter(Boolean).length;

  return `Passed ${passed}/3 requirements`;
}

function verificationSummaryClass(result: VerificationResult): string {
  const passed = [
    result.passSalary,
    result.passCredit,
    result.passEmployment,
  ].filter(Boolean).length;

  if (result.overallEligible) {
    return "text-brand-700 dark:text-accent-200";
  }
  if (passed > 0) {
    return "text-warn-700 dark:text-warn-500";
  }
  return "text-ink-500 dark:text-white/45";
}
