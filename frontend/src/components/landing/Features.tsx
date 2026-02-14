import {
  ScanLine,
  Brain,
  BarChart3,
  Volume2,
  ShieldAlert,
  Heart,
} from 'lucide-react'

const features = [
  {
    icon: ScanLine,
    title: 'Instant Label Scanning',
    description:
      'Point your camera at any food label. Google Gemini extracts every ingredient from the image in seconds.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Extraction',
    description:
      'Advanced vision AI identifies and normalizes ingredient names, even from blurry or crowded labels.',
  },
  {
    icon: BarChart3,
    title: '0\u2013100 Risk Score',
    description:
      'A deterministic scoring engine rates each product based on weighted conflict detection across your profile.',
  },
  {
    icon: ShieldAlert,
    title: 'Allergy Conflict Detection',
    description:
      'Cross-references every ingredient against your specific allergies and flags potential dangers immediately.',
  },
  {
    icon: Heart,
    title: 'Diet & Health Goals',
    description:
      'Customizable dietary preferences and health goals ensure scoring is tailored exactly to your needs.',
  },
  {
    icon: Volume2,
    title: 'Audio Explanations',
    description:
      'Hear a spoken summary of results via ElevenLabs text-to-speech \u2014 perfect for on-the-go accessibility.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </span>
          <h2 className="mt-3 text-4xl font-light tracking-tight text-foreground md:text-6xl text-balance font-serif">
            Everything you need to eat safely
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground font-light">
            From scanning to scoring to speaking &mdash; a complete ingredient
            analysis pipeline built for your safety.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border/60 bg-card/60 p-7 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
