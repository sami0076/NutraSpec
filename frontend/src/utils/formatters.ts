import type { RiskLevel } from '@/types/scanTypes';

/** Map risk classification to a short label (title case). */
export function riskLabel(level: RiskLevel): string {
  switch (level) {
    case 'Low Risk':
      return 'Low';
    case 'Medium Risk':
      return 'Medium';
    case 'High Risk':
      return 'High';
    default:
      return 'Unknown';
  }
}

/** Map risk classification to a Tailwind text color class. */
export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'Low Risk':
      return 'text-green-600';
    case 'Medium Risk':
      return 'text-amber-600';
    case 'High Risk':
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
}

/** Map risk classification to a Tailwind bg class (for badges). */
export function riskBgColor(level: RiskLevel): string {
  switch (level) {
    case 'Low Risk':
      return 'bg-green-100 text-green-700';
    case 'Medium Risk':
      return 'bg-amber-100 text-amber-700';
    case 'High Risk':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

/** Format the 0–100 score as a display string. */
export function formatScore(score: number): string {
  return Math.round(score).toString();
}

/** Percentage for SVG arc calculations (score 0–100). */
export function scorePercent(score: number): number {
  return Math.max(0, Math.min(100, score)) / 100;
}
