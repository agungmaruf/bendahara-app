export function ProgressRing({
  percent,
  size = 120,
  strokeWidth = 10,
  label,
  colorVar = "--teal",
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  colorVar?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`var(${colorVar})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="progress-ring-arc"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <span className="font-display font-mono-num font-semibold text-xl leading-none text-[color:var(--ink)]">
          {Math.round(clamped)}%
        </span>
        {label && <span className="text-[10px] text-[color:var(--ink-soft)] leading-tight mt-1">{label}</span>}
      </div>
    </div>
  );
}
