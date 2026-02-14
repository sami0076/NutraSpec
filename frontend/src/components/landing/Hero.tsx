import { ArrowRight, Camera, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent/50 px-4 py-1.5 text-sm font-medium text-accent-foreground animate-fade-in-up">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built at PatriotHacks 2026
          </div>

          {/* Headline */}
          <h1
            className="max-w-4xl text-5xl font-light leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl text-balance animate-fade-in-up font-serif"
            style={{ animationDelay: '0.1s' }}
          >
            Know exactly{' '}
            <span className="text-primary">{"what's"}</span> in your food.
          </h1>

          {/* Subheadline */}
          <p
            className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl font-light animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Snap a photo of any ingredient label and get a personalized safety
            score based on your allergies, dietary preferences, and health goals.
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link to="/scan">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-semibold gap-2"
              >
                Start Scanning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold border-border text-foreground hover:bg-accent gap-2"
              >
                See How It Works
              </Button>
            </a>
          </div>

          {/* Hero Visual */}
          <div
            className="mt-16 w-full max-w-4xl animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="relative rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Mock scan card */}
                <div className="flex flex-col items-center gap-3 rounded-xl bg-background p-5 border border-border/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Scan Label
                  </span>
                  <span className="text-xs text-muted-foreground text-center">
                    Point your camera at any ingredient list
                  </span>
                </div>

                {/* Mock score card */}
                <div className="flex flex-col items-center gap-3 rounded-xl bg-background p-5 border border-border/50">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <svg
                      className="h-16 w-16 -rotate-90"
                      viewBox="0 0 64 64"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="hsl(44 22% 80%)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="hsl(0 90% 15%)"
                        strokeWidth="4"
                        strokeDasharray={`${0.82 * 175.9} ${175.9}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-lg font-bold text-primary">
                      82
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Safety Score
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    LOW Risk
                  </span>
                </div>

                {/* Mock results card */}
                <div className="flex flex-col items-center gap-3 rounded-xl bg-background p-5 border border-border/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Safe for You
                  </span>
                  <span className="text-xs text-muted-foreground text-center">
                    Personalized to your dietary profile
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
