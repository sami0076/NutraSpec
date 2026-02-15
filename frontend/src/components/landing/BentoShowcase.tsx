import { motion } from 'framer-motion'
import {
  Eye,
  Mic,
  ShieldCheck,
  Smartphone,
  Globe,
  AlertTriangle,
} from 'lucide-react'

const bentoItems = [
  {
    icon: Eye,
    title: 'Gemini Vision AI',
    description:
      'State-of-the-art image recognition that accurately reads ingredient lists from any angle, language, or packaging format.',
    className: 'md:col-span-2 md:row-span-1',
    highlight: true,
  },
  {
    icon: ShieldCheck,
    title: 'Deterministic Scoring',
    description:
      'No AI hallucinations on your safety data. Pure logic with weighted conflict detection across 90+ tracked ingredients.',
    className: 'md:col-span-1 md:row-span-2',
    highlight: false,
  },
  {
    icon: AlertTriangle,
    title: 'Risk Levels',
    description:
      'Clear LOW / MEDIUM / HIGH classifications with detailed conflict breakdowns.',
    className: 'md:col-span-1',
    highlight: false,
  },
  {
    icon: Mic,
    title: 'ElevenLabs TTS',
    description:
      'Natural voice explanations so you can listen to results hands-free while shopping.',
    className: 'md:col-span-1',
    highlight: false,
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description:
      'Designed for quick scans in the grocery store aisle. Fast, accessible, responsive.',
    className: 'md:col-span-1',
    highlight: false,
  },
  {
    icon: Globe,
    title: 'Scan History & Profiles',
    description:
      'Every scan is persisted in Supabase. Track your history and refine your dietary profile over time.',
    className: 'md:col-span-1',
    highlight: false,
  },
]

export function BentoShowcase() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header — scroll reveal */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wider text-primary block"
          >
            Deep Dive
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-3 text-4xl font-light tracking-tight text-foreground md:text-6xl text-balance font-serif"
          >
            Powerful capabilities, beautifully simple
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 text-lg leading-relaxed text-muted-foreground font-light"
          >
            A closer look at what makes NutraSpec the smartest way to
            understand your food.
          </motion.p>
        </div>

        {/* Bento grid — staggered reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            hidden: {},
          }}
          className="mt-16 grid gap-4 md:grid-cols-3 md:auto-rows-[minmax(180px,auto)]"
        >
          {bentoItems.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 },
              }}
              transition={{ duration: 0.5 }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all hover:shadow-lg hover:shadow-primary/5 ${
                item.highlight
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border/60 bg-card/60 hover:border-primary/20 hover:bg-card'
              } ${item.className}`}
            >
              <div>
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
                    item.highlight
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                  } transition-colors`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
