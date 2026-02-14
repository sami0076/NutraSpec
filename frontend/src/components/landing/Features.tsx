import {
  Camera,
  ShieldAlert,
  Volume2,
  ArrowRight,
  AlertTriangle,
  Leaf,
  BarChart3,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function Features() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Feature cards grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 - Instant Scanning */}
          <div className="group flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-8 transition-colors hover:border-primary/30 shadow-sm">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Snap and scan any label
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Point your camera at any food label. Our Gemini-powered AI
                extracts every ingredient in seconds — no manual entry, no
                barcode needed.
              </p>
            </div>
            {/* Mini mockup */}
            <div className="mt-8 space-y-2">
              {['Photo of ingredient label...', 'Extracting 14 ingredients...'].map(
                (q) => (
                  <div
                    key={q}
                    className="flex items-center gap-3 rounded-lg border border-border/30 bg-secondary/30 px-4 py-2.5"
                  >
                    <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{q}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Feature 2 - Risk Scoring */}
          <div className="group flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-8 transition-colors hover:border-primary/30 shadow-sm">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Personalized risk scoring
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every ingredient is scored against your allergy profile, dietary
                preferences, and health goals. Conflicts are flagged instantly
                with clear explanations.
              </p>
            </div>
            {/* Mini conflict list mockup */}
            <div className="mt-8 space-y-2">
              {[
                {
                  name: 'Peanut Oil',
                  reason: 'Severe allergy',
                  level: 'HIGH',
                },
                {
                  name: 'Red 40',
                  reason: 'Ultra-processed',
                  level: 'MEDIUM',
                },
                {
                  name: 'Soy Lecithin',
                  reason: 'Soy sensitivity',
                  level: 'LOW',
                },
              ].map((conflict) => (
                <div
                  key={conflict.name}
                  className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 px-4 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground">
                      {conflict.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {conflict.reason}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        conflict.level === 'HIGH'
                          ? 'bg-red-100 text-red-600'
                          : conflict.level === 'MEDIUM'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {conflict.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 3 - Voice Explanation */}
          <div className="group flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-8 transition-colors hover:border-primary/30 shadow-sm md:col-span-2 lg:col-span-1">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Volume2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Hear your results spoken
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Get a natural-sounding audio explanation of your scan results
                powered by ElevenLabs. Perfect for on-the-go grocery shopping or
                accessibility needs.
              </p>
            </div>
            {/* Audio mockup */}
            <div className="mt-8">
              <div className="rounded-xl border border-border/30 bg-secondary/30 p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Audio Summary
                </p>
                <p className="mb-4 text-sm text-foreground">
                  {'"'}This product contains peanut oil, which is a severe
                  allergen conflict for your profile...{'"'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] text-primary">
                    <Volume2 className="h-3 w-3" />
                    ElevenLabs TTS
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground">
                    <Leaf className="h-3 w-3" />
                    Diet Analysis
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground">
                    <BarChart3 className="h-3 w-3" />
                    Risk Score
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/scan"
            className="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
          >
            Try It Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
