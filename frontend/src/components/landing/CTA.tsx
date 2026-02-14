import { ArrowRight, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function CTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 md:p-16">
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-foreground/5 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-sm">
              <Leaf className="h-7 w-7 text-primary-foreground" />
            </div>

            <h2 className="mt-6 text-4xl font-light tracking-tight text-primary-foreground md:text-6xl text-balance font-serif">
              Ready to eat with confidence?
            </h2>
            <p className="mt-4 max-w-lg text-xl leading-relaxed text-primary-foreground/80 font-light">
              Start scanning ingredient labels today and get personalized safety
              scores powered by AI.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Link to="/scan">
                <Button
                  size="lg"
                  className="rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-6 text-base font-semibold gap-2"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-base font-semibold"
                >
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
