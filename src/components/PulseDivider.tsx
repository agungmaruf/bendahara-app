export function PulseDivider({ color = "var(--teal)" }: { color?: string }) {
  return (
    <div className="pulse-divider" aria-hidden="true">
      <svg viewBox="0 0 600 28" preserveAspectRatio="none">
        <polyline
          className="pulse-line"
          points="0,14 210,14 226,14 236,2 246,26 256,6 266,14 600,14"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
