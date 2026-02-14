import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CTA() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-12 text-center shadow-lg shadow-orange-500/5 md:p-20">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(24_95%_53%/0.06)_0%,transparent_70%)]" />

          <h2 className="relative font-serif text-3xl leading-snug tracking-tight text-foreground md:text-5xl md:leading-tight">
            <span className="text-balance">
              Stop guessing what{"'"}s in your food.
            </span>
          </h2>

          <p className="relative mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            Scan any ingredient label and get instant, personalized risk analysis.
            Your allergies, your diet, your rules.
          </p>

          <div className="relative mt-10 flex justify-center">
            <Link
              to="/scan"
              className="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
