import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ICON_CDN = 'https://cdn.simpleicons.org';

/** Logo slug for Simple Icons CDN (cdn.simpleicons.org/slug). Fallback to first word if missing. */
const TECH_ICONS: Record<string, string> = {
  'React 19': 'react',
  TypeScript: 'typescript',
  Vite: 'vite',
  'Tailwind CSS v4': 'tailwindcss',
  'Lucide Icons': 'lucide',
  'Python 3.11+': 'python',
  FastAPI: 'fastapi',
  Pydantic: 'pydantic',
  Uvicorn: 'uvicorn',
  'Google Gemini API': 'google',
  'ElevenLabs TTS': 'elevenlabs',
  'Supabase (PostgreSQL)': 'supabase',
  'Custom Deterministic Engine': 'chartdotjs',
};

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
];

function TechBadge({ item }: { item: string }) {
  const slug = TECH_ICONS[item];
  const iconUrl = slug ? `${ICON_CDN}/${slug}` : null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-foreground">
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          className="h-4 w-4 shrink-0"
          width={16}
          height={16}
        />
      ) : null}
      {item}
    </span>
  );
}

const tickerItems = [
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
];

const TICKER_ICONS: Record<string, string> = {
  React: 'react',
  TypeScript: 'typescript',
  'Tailwind CSS': 'tailwindcss',
  FastAPI: 'fastapi',
  Python: 'python',
  'Google Gemini': 'google',
  ElevenLabs: 'elevenlabs',
  Supabase: 'supabase',
  PostgreSQL: 'postgresql',
  Vite: 'vite',
  Pydantic: 'pydantic',
  Uvicorn: 'uvicorn',
};

export function TechStack() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-80px' });

  return (
    <section id="tech-stack" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header with motion */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wider text-primary"
          >
            Tech Stack
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-3 font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl text-balance"
          >
            Built with modern, proven tools
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg leading-relaxed text-muted-foreground font-light"
          >
            A carefully selected stack optimized for speed, reliability, and
            developer experience.
          </motion.p>
        </div>

        {/* Tech grid with useInView stagger */}
        <div
          ref={gridRef}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {techItems.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 40 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                {group.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <TechBadge key={item} item={item} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auto-sliding horizontal ticker (seamless loop) */}
        <div className="relative mt-16 overflow-hidden">
          <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          <div
            className="flex gap-12 whitespace-nowrap py-4 w-max"
            style={{ animation: 'marquee 35s linear infinite' }}
          >
            {[...tickerItems, ...tickerItems].map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground/60"
              >
                {TICKER_ICONS[label] ? (
                  <img
                    src={`${ICON_CDN}/${TICKER_ICONS[label]}`}
                    alt=""
                    className="h-4 w-4 shrink-0 opacity-80"
                    width={16}
                    height={16}
                  />
                ) : null}
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
