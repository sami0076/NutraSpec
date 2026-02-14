const techItems = [
  {
    category: 'Frontend',
    items: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Lucide Icons'],
  },
  {
    category: 'Backend',
    items: ['Python 3.11+', 'FastAPI', 'Pydantic', 'Uvicorn'],
  },
  {
    category: 'AI / Vision',
    items: ['Google Gemini API'],
  },
  {
    category: 'Voice',
    items: ['ElevenLabs TTS'],
  },
  {
    category: 'Database',
    items: ['Supabase (PostgreSQL)'],
  },
  {
    category: 'Scoring',
    items: ['Custom Deterministic Engine'],
  },
]

const marqueeLabels = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'FastAPI',
  'Python',
  'Google Gemini',
  'ElevenLabs',
  'Supabase',
  'PostgreSQL',
  'Vite',
  'Pydantic',
  'Uvicorn',
]

export function TechStack() {
  return (
    <section id="tech-stack" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Tech Stack
          </span>
          <h2 className="mt-3 text-4xl font-light tracking-tight text-foreground md:text-6xl text-balance font-serif">
            Built with modern, proven tools
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground font-light">
            A carefully selected stack optimized for speed, reliability, and
            developer experience.
          </p>
        </div>

        {/* Tech grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techItems.map((group) => (
            <div
              key={group.category}
              className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                {group.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Scrolling marquee */}
        <div className="relative mt-16 overflow-hidden">
          <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
          <div className="flex animate-marquee gap-12 whitespace-nowrap py-4">
            {[...marqueeLabels, ...marqueeLabels].map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="text-sm font-medium text-muted-foreground/60"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
