import { Camera, Cpu, BarChart3, Volume2 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Camera,
    title: 'Scan',
    description:
      'Point your camera at any ingredient label. Google Gemini extracts every ingredient from the image.',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'Analyze',
    description:
      'A deterministic scoring engine cross-references each ingredient against your allergy profile, dietary restrictions, and health goals.',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Score',
    description:
      'Get a 0\u2013100 risk score with clear conflict breakdowns (LOW / MEDIUM / HIGH) and a human-readable explanation.',
  },
  {
    number: '04',
    icon: Volume2,
    title: 'Listen',
    description:
      'Hear a spoken summary of the results via ElevenLabs text-to-speech for quick, hands-free feedback.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-card/50">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </span>
          <h2 className="mt-3 text-4xl font-light tracking-tight text-foreground md:text-6xl text-balance font-serif">
            From photo to safety score in seconds
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground font-light">
            Four simple steps to understand exactly what goes into your body.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-8 translate-x-full bg-border lg:block" />
              )}

              <div className="flex flex-col items-start">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-primary/60">
                    {step.number}
                  </span>
                  <div className="h-px flex-1 bg-border lg:hidden" />
                </div>

                <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Flow diagram */}
        <div className="mt-20 rounded-2xl border border-border/60 bg-background p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {[
              { label: 'Photo Input', sub: 'Camera / Upload' },
              { label: 'Gemini Vision', sub: 'Ingredient Extraction' },
              { label: 'Scoring Engine', sub: 'Conflict Detection' },
              { label: 'Risk Report', sub: 'Score + Audio' },
            ].map((item, i) => (
              <div
                key={item.label}
                className="flex items-center gap-4 md:flex-1"
              >
                <div className="flex-1 rounded-xl border border-border/50 bg-card p-4 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
                {i < 3 && (
                  <div className="hidden text-primary/40 md:block">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
