import { Bot, Sparkles } from 'lucide-react'

export function About() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            How It Works
          </span>
        </div>

        {/* Section heading */}
        <h2 className="mx-auto max-w-3xl text-center font-serif text-3xl leading-snug tracking-tight text-foreground md:text-5xl md:leading-tight">
          <span className="text-balance">
            AI-powered ingredient analysis,{' '}
            <span className="text-primary">personalized for you.</span>
          </span>
        </h2>

        {/* Sub text */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
          FoodFinder.AI uses Google Gemini to extract every ingredient from a
          photo of any food label, then scores each one against your personal
          allergy profile and dietary goals.
        </p>

        {/* AI Agent Card */}
        <div className="mx-auto mt-16 max-w-lg">
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg shadow-orange-500/5">
            {/* Agent header */}
            <div className="flex items-center gap-3 border-b border-border/50 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  FoodFinder AI
                </p>
                <p className="text-xs text-muted-foreground">
                  Ingredient Risk Analyst
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs text-green-600">Analyzing</span>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-3 p-5">
              <div className="rounded-xl rounded-tl-sm bg-secondary/80 p-4">
                <p className="text-sm leading-relaxed text-foreground">
                  I{"'"}ve detected <strong>14 ingredients</strong> in this
                  product. Based on your peanut allergy profile, I found{' '}
                  <span className="font-semibold text-red-500">
                    2 high-risk conflicts
                  </span>
                  . Overall risk score:{' '}
                  <span className="font-semibold text-primary">62/100</span>.
                </p>
              </div>
              <div className="rounded-xl rounded-tl-sm bg-secondary/80 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    Audio explanation ready
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tap to hear a spoken summary of this product{"'"}s risk
                  factors, powered by ElevenLabs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
