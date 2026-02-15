import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Monitor, Server, Sparkles, Database } from 'lucide-react';

const ICON_CDN = 'https://cdn.simpleicons.org';

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
};

const CATEGORY_ICONS = {
  Frontend: Monitor,
  Backend: Server,
  'AI & Voice': Sparkles,
  Database: Database,
};

const techItems = [
  { category: 'Frontend', items: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Lucide Icons'] },
  { category: 'Backend', items: ['Python 3.11+', 'FastAPI', 'Pydantic', 'Uvicorn'] },
  { category: 'AI & Voice', items: ['Google Gemini API', 'ElevenLabs TTS'] },
  { category: 'Database', items: ['Supabase (PostgreSQL)'] },
];

function TechBadge({ item }: { item: string }) {
  const slug = TECH_ICONS[item];
  const iconUrl = slug ? `${ICON_CDN}/${slug}` : null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground">
      {iconUrl ? (
        <img src={iconUrl} alt="" className="h-3.5 w-3.5 shrink-0" width={14} height={14} />
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

        {/* 4 categories in a 2×2 grid — clear and balanced */}
        <div
          ref={gridRef}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-4xl mx-auto"
        >
          {techItems.map((group, i) => {
            const Icon = CATEGORY_ICONS[group.category as keyof typeof CATEGORY_ICONS];
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.33, 1, 0.68, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/80 px-7 py-7 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary/15 group-hover:ring-primary/20">
                    {Icon ? <Icon className="h-6 w-6" /> : null}
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {group.category}
                  </h3>
                </div>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <TechBadge key={item} item={item} />
                  ))}
                </div>
              </motion.div>
            );
          })}
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
