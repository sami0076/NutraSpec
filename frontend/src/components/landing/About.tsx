import { Database, ShieldCheck, Zap } from 'lucide-react'

const stats = [
  { value: '90+', label: 'Ingredients tracked' },
  { value: '0\u2013100', label: 'Risk scoring range' },
  { value: '50+', label: 'Allergy categories' },
  { value: '<2s', label: 'Average scan time' },
]

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-card/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left column — text */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              About FoodFinder.AI
            </span>
            <h2 className="mt-3 text-4xl font-light tracking-tight text-foreground md:text-6xl text-balance font-serif">
              Real-time, audit-ready food safety analysis.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground font-light">
              FoodFinder.AI combines the power of Google Gemini vision with a
              fully deterministic scoring engine to give you accurate, unbiased
              ingredient risk scores. No AI guessing on your safety &mdash; just
              pure logic with weighted conflict detection.
            </p>

            <div className="mt-8 flex flex-col gap-5">
              {[
                {
                  icon: Zap,
                  title: 'Instant Results',
                  desc: 'Get your risk score within seconds of scanning a label.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Personalized Safety',
                  desc: 'Scoring is based on your unique allergy profile and health goals.',
                },
                {
                  icon: Database,
                  title: 'Full History',
                  desc: 'Every scan is saved to your profile for easy reference later.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — stats + visual */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border/60 bg-background p-6 text-center"
                >
                  <p className="text-3xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Schema preview card */}
            <div className="rounded-2xl border border-border/60 bg-background p-6">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                Database Schema
              </h4>
              <div className="space-y-2 font-mono text-xs leading-relaxed text-muted-foreground">
                <p>
                  <span className="text-foreground font-semibold">users</span>{' '}
                  &mdash; id, email, created_at
                </p>
                <p>
                  <span className="text-foreground font-semibold">
                    user_preferences
                  </span>{' '}
                  &mdash; allergies[], dietary_preferences[], health_goals[]
                </p>
                <p>
                  <span className="text-foreground font-semibold">
                    scan_history
                  </span>{' '}
                  &mdash; product_name, risk_score, risk_level, conflicts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
