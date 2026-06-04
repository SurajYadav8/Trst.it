import { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-ink-200 bg-white px-6 py-12 text-center dark:border-white/12 dark:bg-white/[0.02]">
      <h3 className="text-base font-semibold text-ink-900 dark:text-white">
        {title}
      </h3>
      {description ? (
        <p className="mt-1 text-sm text-ink-500 mx-auto max-w-md dark:text-white/50">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
