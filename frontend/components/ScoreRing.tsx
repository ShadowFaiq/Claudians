interface ScoreRingProps {
  score: number;
  size?: number;
}

const COLORS: Record<string, string> = {
  high:   "url(#grad-high)",
  mid:    "url(#grad-mid)",
  low:    "url(#grad-low)",
};

export default function ScoreRing({ score, size = 64 }: ScoreRingProps) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const tier = score >= 70 ? "high" : score >= 45 ? "mid" : "low";

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="flex-shrink-0">
      <defs>
        <linearGradient id="grad-high" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="grad-mid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
        <linearGradient id="grad-low" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
      {/* Progress */}
      <circle
        cx="32" cy="32" r={r} fill="none"
        stroke={COLORS[tier]} strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 32 32)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">
        {score}
      </text>
    </svg>
  );
}
