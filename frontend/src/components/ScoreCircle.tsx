import { scorePercent, formatScore } from '@/utils/formatters';
import { riskColor } from '@/utils/formatters';
import type { RiskLevel } from '@/types/scanTypes';

interface ScoreCircleProps {
  score: number;
  riskLevel: RiskLevel;
  size?: number;
}

/**
 * SVG circular score display. Shows 0–100 score with a colored arc.
 */
export function ScoreCircle({ score, riskLevel, size = 140 }: ScoreCircleProps) {
  const pct = scorePercent(score);
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  // Map risk level to stroke color
  const strokeColor =
    riskLevel === 'Low Risk'
      ? '#16a34a'
      : riskLevel === 'Medium Risk'
        ? '#d97706'
        : '#dc2626';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="hsl(44 22% 80%)"
          strokeWidth="8"
        />
        {/* Score arc */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Score number overlaid */}
      <div className="absolute flex flex-col items-center" style={{ marginTop: size * 0.25 }}>
        <span className={`text-4xl font-bold ${riskColor(riskLevel)}`}>
          {formatScore(score)}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">out of 100</span>
      </div>
    </div>
  );
}
