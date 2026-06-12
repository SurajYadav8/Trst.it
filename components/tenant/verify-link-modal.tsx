"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractVerificationSlug } from "@/lib/verify-link";

export function VerifyLinkModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setValue("");
      setError(null);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = extractVerificationSlug(value);
    if (!slug) {
      setError("Enter a verification link or code from your landlord.");
      return;
    }
    onClose();
    router.push(`/verify/${slug}`);
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            className="absolute inset-0 bg-night-950/40 backdrop-blur-[2px] dark:bg-night-950/60"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-labelledby="verify-link-title"
            aria-modal="true"
            className="relative w-full max-w-md rounded-lg border border-ink-200 bg-white p-6 shadow-card dark:border-white/12 dark:bg-night-900"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              id="verify-link-title"
              className="text-lg font-semibold tracking-tight text-ink-900 dark:text-white"
            >
              Paste Verification Link
            </h2>
            <p className="mt-1.5 text-sm text-ink-500 dark:text-white/50">
              Paste the share link or code your landlord sent you.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <Input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://…/verify/abc123 or abc123"
                aria-label="Verification link or code"
                autoFocus
              />
              {error ? (
                <p className="text-xs text-danger-600 dark:text-danger-500">
                  {error}
                </p>
              ) : null}
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Verify</Button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
