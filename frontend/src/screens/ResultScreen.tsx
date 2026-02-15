import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ScanLine,
  Leaf,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
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
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <button
              onClick={() => navigate('/scan')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Scan Again
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">
              NutraSpec
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
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Scan', to: '/scan' }, { label: 'Result' }]} />
        {/* 1. Product name (e.g. Lays, Pringles) */}
        <div className="mt-4 rounded-xl border border-border/60 bg-card p-6 mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            Product
          </h2>
          <h1 className="text-2xl font-light text-foreground font-serif md:text-3xl">
            {result.product_name || result.brand || 'Unknown Product'}
          </h1>
          {result.brand && result.product_name && result.product_name !== result.brand && (
            <p className="mt-1 text-sm text-muted-foreground">
              {result.brand}
            </p>
          )}
        </div>

        {/* 2. Ingredients */}
        <div className="rounded-xl border border-border/60 bg-card p-6 mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
            Ingredients
          </h2>
          <p className="text-sm leading-relaxed text-foreground">
            {(result.ingredients || []).length > 0
              ? (result.ingredients || []).map((i) => i.replace(/_/g, ' ')).join(', ')
              : 'No ingredients extracted.'}
          </p>
        </div>

        {/* 3. Risks (if any) */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
            Risks for Your Profile
          </h2>
          {result.conflict_count > 0 ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <ScoreCircle
                  score={result.score}
                  riskLevel={result.risk_classification}
                  size={100}
                />
                <div>
                  <RiskBadge level={result.risk_classification} className="text-sm px-4 py-1.5" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {result.summary}
                  </p>
                </div>
              </div>
              <ConflictList flagged={result.flagged_ingredients} />
            </>
          ) : (
            <div className="rounded-xl border border-border/60 bg-card p-6 text-center">
              <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">
                No risks detected for your profile.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.summary}
              </p>
            </div>
          )}
        </div>

        {/* Audio player */}
        {result.audio_base64 && (
          <div className="mt-6 flex justify-center">
            <AudioPlayer audioBase64={result.audio_base64} />
          </div>
        )}

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
