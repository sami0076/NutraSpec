const techStack = [
  { name: 'Google Gemini', bg: 'bg-blue-50', text: 'text-blue-600' },
  { name: 'ElevenLabs', bg: 'bg-violet-50', text: 'text-violet-600' },
  { name: 'Supabase', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { name: 'FastAPI', bg: 'bg-teal-50', text: 'text-teal-600' },
  { name: 'React', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  { name: 'TypeScript', bg: 'bg-blue-50', text: 'text-blue-700' },
  { name: 'Vite', bg: 'bg-purple-50', text: 'text-purple-600' },
  { name: 'Python', bg: 'bg-yellow-50', text: 'text-yellow-700' },
]

const techStack2 = [
  { name: 'Tailwind CSS', bg: 'bg-sky-50', text: 'text-sky-600' },
  { name: 'Pydantic', bg: 'bg-red-50', text: 'text-red-600' },
  { name: 'PostgreSQL', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { name: 'Uvicorn', bg: 'bg-green-50', text: 'text-green-700' },
  { name: 'Lucide Icons', bg: 'bg-orange-50', text: 'text-orange-600' },
  { name: 'REST API', bg: 'bg-gray-100', text: 'text-gray-700' },
  { name: 'Zod', bg: 'bg-blue-50', text: 'text-blue-600' },
  { name: 'React Router', bg: 'bg-red-50', text: 'text-red-500' },
]

function TechChip({
  name,
  bg,
  text,
}: {
  name: string
  bg: string
  text: string
}) {
  return (
    <div
      className={`flex shrink-0 items-center gap-2.5 rounded-full border border-border/30 ${bg} px-5 py-3`}
    >
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-md ${bg} ${text} text-xs font-bold`}
      >
        {name.charAt(0)}
      </div>
      <span className="text-sm font-medium text-foreground">{name}</span>
    </div>
  )
}

export function TechStack() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Tech Stack
          </span>
        </div>

        {/* Heading */}
        <h2 className="mx-auto max-w-3xl text-center font-serif text-3xl leading-snug tracking-tight text-foreground md:text-5xl md:leading-tight">
          Powered by modern tools.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
          FoodFinder.AI is built on a robust stack of modern frameworks and APIs.
          Google Gemini handles vision, ElevenLabs provides voice, and Supabase
          powers the data layer — all orchestrated through FastAPI.
        </p>

        {/* Scrolling marquees */}
        <div className="relative mt-16 space-y-4 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

          {/* Row 1 */}
          <div
            className="animate-marquee flex gap-4"
            style={{ width: 'max-content' }}
          >
            {[...techStack, ...techStack].map((item, i) => (
              <TechChip key={`row1-${i}`} {...item} />
            ))}
          </div>

          {/* Row 2 - reverse direction */}
          <div
            className="animate-marquee-reverse flex gap-4"
            style={{ width: 'max-content' }}
          >
            {[...techStack2, ...techStack2].map((item, i) => (
              <TechChip key={`row2-${i}`} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
