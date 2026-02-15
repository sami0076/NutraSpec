import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Info, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '@/utils/constants';

export default function SettingsScreen() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">
              NutraSpec
            </span>
          </div>
          <div className="w-12" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-light text-foreground font-serif md:text-3xl">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              App configuration and information.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* API connection */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              API Connection
            </h3>
            <p className="text-sm text-muted-foreground">
              Backend URL:{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">
                {API_BASE_URL}
              </code>
            </p>
          </div>

          {/* About */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              About NutraSpec
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered ingredient risk scoring app built at PatriotHacks 2026.
              Scan any food label, get a personalized safety analysis based on
              your allergies, dietary preferences, and health goals.
            </p>
          </div>

          {/* Tech stack */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Powered By
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Google Gemini',
                'ElevenLabs',
                'Supabase',
                'FastAPI',
                'React',
                'Tailwind CSS',
              ].map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Links
            </h3>
            <div className="space-y-2">
              <a
                href={`${API_BASE_URL}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                API Documentation (Swagger)
              </a>
              <a
                href={`${API_BASE_URL}/health`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Health Check
              </a>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          NutraSpec v1.0.0 &mdash; PatriotHacks 2026
        </p>
      </div>
    </div>
  );
}
