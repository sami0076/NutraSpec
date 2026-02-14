import { AlertTriangle } from 'lucide-react';
import type { FlaggedIngredient } from '@/types/scanTypes';
import { riskBgColor, riskLabel } from '@/utils/formatters';

interface ConflictListProps {
  flagged: FlaggedIngredient[];
}

/**
 * List of flagged ingredient conflicts (allergies, dietary restrictions, etc.).
 * All ingredients are shown in the main Ingredients section from Gemini.
 */
export function ConflictList({ flagged }: ConflictListProps) {
  if (flagged.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No conflicts detected. This product looks safe for your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {flagged.map((item) => (
        <div
          key={item.ingredient}
          className="rounded-xl border border-border/60 bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-semibold text-foreground">
                {item.ingredient}
              </span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${riskBgColor(item.risk_level)}`}
            >
              {riskLabel(item.risk_level)}
            </span>
          </div>
          {item.reasons.length > 0 && (
            <ul className="mt-2 space-y-1 pl-6">
              {item.reasons.map((reason, i) => (
                <li key={i} className="text-xs text-muted-foreground list-disc">
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
