import { ArrowRight, ShieldCheck, Scan, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20">
      {/* Background radial gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(24_95%_53%/0.06)_0%,transparent_70%)]" />

      {/* Hackathon badge */}
      <div className="mb-8 flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-2">
        <span className="text-xs text-muted-foreground">Built at</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground">
            PatriotHacks 2026
          </span>
        </div>
      </div>

      {/* Main heading */}
      <h1 className="max-w-4xl text-center font-serif text-5xl leading-tight tracking-tight text-foreground md:text-7xl md:leading-[1.1]">
        <span className="text-balance">
          Know what{"'"}s in your food.{' '}
          <span className="text-primary">Instantly.</span>
        </span>
      </h1>

      <p className="mt-4 max-w-xl text-center text-lg text-muted-foreground md:text-xl">
        Scan any ingredient label. Get an AI-powered risk score tailored to your
        dietary needs and allergies.
      </p>

      {/* CTA Button */}
      <Link
        to="/scan"
        className="group mt-10 flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
      >
        Start Scanning
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>

      {/* App mockup */}
      <div className="relative mt-16 w-full max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-orange-500/5">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-300/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-300/60" />
            <div className="h-3 w-3 rounded-full bg-green-300/60" />
            <div className="ml-4 h-4 w-40 rounded bg-muted/50" />
          </div>

          <div className="grid grid-cols-3 gap-4 p-6 md:p-8">
            {/* Left column - Scan result */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-foreground">
                  Risk Score
                </span>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
                  MEDIUM — 62/100
                </span>
              </div>

              {/* Ingredient bars */}
              <div className="space-y-2">
                {[
                  { name: 'Maltodextrin', risk: 45, color: 'bg-yellow-400' },
                  { name: 'Soy Lecithin', risk: 30, color: 'bg-green-400' },
                  { name: 'Red 40', risk: 75, color: 'bg-red-400' },
                  { name: 'Peanut Oil', risk: 95, color: 'bg-red-500' },
                  { name: 'Citric Acid', risk: 10, color: 'bg-green-300' },
                  { name: 'Natural Flavors', risk: 35, color: 'bg-yellow-300' },
                ].map((ing) => (
                  <div key={ing.name} className="flex items-center gap-3">
                    <span className="w-28 text-xs text-muted-foreground">
                      {ing.name}
                    </span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted/50">
                      <div
                        className={`h-full rounded-full ${ing.color} transition-all`}
                        style={{ width: `${ing.risk}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-medium text-foreground">
                      {ing.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - Stats */}
            <div className="space-y-3">
              {[
                {
                  icon: AlertTriangle,
                  label: 'Allergen Conflicts',
                  value: '2 found',
                  color: 'text-red-500',
                },
                {
                  icon: ShieldCheck,
                  label: 'Diet Compliance',
                  value: '78%',
                  color: 'text-green-500',
                },
                {
                  icon: Scan,
                  label: 'Ingredients',
                  value: '14 detected',
                  color: 'text-primary',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border/50 bg-secondary/30 p-3"
                >
                  <div className="flex items-center gap-2">
                    <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fade out bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  )
}
