import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ScanLine,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScoreCircle } from '@/components/ScoreCircle';
import { RiskBadge } from '@/components/RiskBadge';
import { ConflictList } from '@/components/ConflictList';
import { AudioPlayer } from '@/components/AudioPlayer';
import type { AnalyzeResult } from '@/types/scanTypes';

export default function ResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as { result?: AnalyzeResult })?.result;

  // No result in state — redirect to scan
  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <HelpCircle className="h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-light text-foreground font-serif">
          No scan results
        </h1>
        <p className="mt-2 text-muted-foreground">
          Scan a food label first to see your results here.
        </p>
        <Link to="/scan" className="mt-6">
          <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 gap-2">
            <ScanLine className="h-4 w-4" />
            Go to Scanner
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/scan')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Scan Again</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">
              FoodFinder<span className="text-primary">.AI</span>
            </span>
          </div>
          <Link
            to="/profile"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Profile
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Score hero */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <ScoreCircle
              score={result.score}
              riskLevel={result.risk_classification}
              size={160}
            />
          </div>

          <div className="mt-16">
            <RiskBadge level={result.risk_classification} className="text-sm px-4 py-1.5" />
          </div>

          <h1 className="mt-4 text-2xl font-light text-foreground font-serif md:text-3xl">
            Safety Score: {Math.round(result.score)}
          </h1>
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-primary">
              <ScanLine className="h-4 w-4" />
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">
              {result.total_ingredients}
            </p>
            <p className="text-xs text-muted-foreground">Ingredients</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">
              {result.conflict_count}
            </p>
            <p className="text-xs text-muted-foreground">Conflicts</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">
              {result.unknown_ingredients.length}
            </p>
            <p className="text-xs text-muted-foreground">Unknown</p>
          </div>
        </div>

        {/* Summary */}
        {result.summary && (
          <div className="mt-8 rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Summary
            </h2>
            <p className="text-sm leading-relaxed text-foreground">
              {result.summary}
            </p>
          </div>
        )}

        {/* Audio player */}
        {result.audio_base64 && (
          <div className="mt-6 flex justify-center">
            <AudioPlayer audioBase64={result.audio_base64} />
          </div>
        )}

        {/* Conflict list */}
        <div className="mt-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
            Ingredient Details
          </h2>
          <ConflictList
            flagged={result.flagged_ingredients}
            unknown={result.unknown_ingredients}
          />
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/scan">
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-5 text-base font-semibold gap-2">
              <ScanLine className="h-4 w-4" />
              Scan Another
            </Button>
          </Link>
          <Link to="/profile">
            <Button
              variant="outline"
              className="rounded-full px-8 py-5 text-base font-semibold border-border text-foreground hover:bg-accent"
            >
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
