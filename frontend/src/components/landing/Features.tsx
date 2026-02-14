import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ScanLine,
  Brain,
  BarChart3,
  Volume2,
  ShieldAlert,
  Heart,
} from 'lucide-react';

const features = [
  {
    icon: ScanLine,
    title: 'Instant Label Scanning',
    description:
      'Point your camera at any food label. Google Gemini extracts every ingredient from the image in seconds.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Extraction',
    description:
      'Advanced vision AI identifies and normalizes ingredient names, even from blurry or crowded labels.',
  },
  {
    icon: BarChart3,
    title: '0\u2013100 Risk Score',
    description:
      'A deterministic scoring engine rates each product based on weighted conflict detection across your profile.',
  },
  {
    icon: ShieldAlert,
    title: 'Allergy Conflict Detection',
    description:
      'Cross-references every ingredient against your specific allergies and flags potential dangers immediately.',
  },
  {
    icon: Heart,
    title: 'Diet & Health Goals',
    description:
      'Customizable dietary preferences and health goals ensure scoring is tailored exactly to your needs.',
  },
  {
    icon: Volume2,
    title: 'Audio Explanations',
    description:
      'Hear a spoken summary of results via ElevenLabs text-to-speech \u2014 perfect for on-the-go accessibility.',
  },
];

export function Features() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  return (
    <section
      id="features"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section header with motion */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wider text-primary"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-3 font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl text-balance"
          >
            Everything you need to eat safely
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg leading-relaxed text-muted-foreground font-light"
          >
            From scanning to scoring to speaking &mdash; a complete ingredient
            analysis pipeline built for your safety.
          </motion.p>
        </div>

        {/* Feature grid with useInView stagger */}
        <div
          ref={gridRef}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              animate={gridInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="group relative rounded-2xl border border-border/60 bg-card/60 p-7 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
