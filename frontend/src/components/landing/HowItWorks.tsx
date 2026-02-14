import { useState } from 'react'
import {
  ArrowRight,
  Camera,
  Brain,
  ShieldCheck,
  Volume2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

const steps = [
  {
    name: '1. Scan',
    icon: Camera,
    color: 'from-orange-100 to-orange-50',
    description:
      'Point your phone camera at any food ingredient label. Our AI instantly captures and reads every ingredient — even from blurry or curved labels.',
  },
  {
    name: '2. Analyze',
    icon: Brain,
    color: 'from-amber-100 to-amber-50',
    description:
      'Google Gemini extracts and normalizes each ingredient. Our scoring engine cross-references them against allergens, dietary flags, and ultra-processing markers.',
  },
  {
    name: '3. Score',
    icon: ShieldCheck,
    color: 'from-green-100 to-green-50',
    description:
      'Get a personalized risk score (0-100) with clear conflict breakdowns. Every ingredient flagged tells you exactly why and how it affects you.',
  },
  {
    name: '4. Listen',
    icon: Volume2,
    color: 'from-blue-100 to-blue-50',
    description:
      'Hear a natural-sounding audio explanation of your results via ElevenLabs text-to-speech. Great for accessibility or when your hands are full at the grocery store.',
  },
]

export function HowItWorks() {
  const [active, setActive] = useState(0)

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            The Process
          </span>
        </div>

        {/* Heading */}
        <h2 className="mx-auto max-w-3xl text-center font-serif text-3xl leading-snug tracking-tight text-foreground md:text-5xl md:leading-tight">
          <span className="text-balance">
            Four steps to{' '}
            <span className="text-primary">safer food choices.</span>
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
          From label to insight in seconds. FoodFinder.AI handles the heavy
          lifting so you can make confident decisions at the shelf.
        </p>

        {/* Step cards */}
        <div className="mt-16 grid gap-4 md:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <button
                key={step.name}
                onClick={() => setActive(i)}
                className={cn(
                  'group relative flex flex-col items-center overflow-hidden rounded-2xl border p-6 text-center transition-all duration-300',
                  active === i
                    ? 'border-primary/30 bg-card shadow-md shadow-orange-500/5'
                    : 'border-border/30 bg-card/50 hover:border-border/50'
                )}
              >
                <div
                  className={cn(
                    'mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-b',
                    step.color
                  )}
                >
                  <Icon className="h-6 w-6 text-foreground" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">
                  {step.name}
                </h4>
                {active === i && (
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 bg-primary" />
                )}
              </button>
            )
          })}
        </div>

        {/* Active description */}
        <div className="mt-8 rounded-2xl border border-border/50 bg-card p-8 text-center shadow-sm">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            {steps[active].description}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/scan"
            className="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
          >
            Start Scanning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
