export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-xl sm:text-2xl font-semibold text-[color:var(--ink)]">{title}</h1>
        {subtitle && <p className="text-sm text-[color:var(--ink-soft)] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
