import type { RiskLevel } from '@/types/scanTypes';
import { riskLabel, riskBgColor } from '@/utils/formatters';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

/**
 * Colored badge showing risk classification (LOW / MEDIUM / HIGH).
 */
export function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${riskBgColor(level)} ${className}`}
    >
      {riskLabel(level)} RISK
    </span>
  );
}
