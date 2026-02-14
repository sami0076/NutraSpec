import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Database, ShieldCheck, Zap } from 'lucide-react';

const highlights = [
  {
    icon: Zap,
    title: 'Instant Results',
    desc: 'Get your risk score within seconds of scanning a label.',
  },
  {
    icon: ShieldCheck,
    title: 'Personalized Safety',
    desc: 'Scoring is based on your unique allergy profile and health goals.',
  },
  {
    icon: Database,
    title: 'Full History',
    desc: 'Every scan is saved to your profile for easy reference later.',
  },
];

const stats = [
  { value: '90+', label: 'Ingredients tracked' },
  { value: '0\u2013100', label: 'Risk scoring range' },
  { value: '50+', label: 'Allergy categories' },
  { value: '<2s', label: 'Average scan time' },
];

const descriptionText =
  'FoodFinder.AI combines the power of Google Gemini vision with a fully deterministic scoring engine to give you accurate, unbiased ingredient risk scores. No AI guessing on your safety &mdash; just pure logic with weighted conflict detection.';

export function About() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftInView = useInView(leftRef, { once: true, margin: '-80px' });
  const rightInView = useInView(rightRef, { once: true, margin: '-80px' });

  const descriptionWords = descriptionText.split(/\s+/);

  return (
    <section
      id="about"
      className="relative overflow-hidden py-24 md:py-32 bg-card/50"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left column — text */}
          <div ref={leftRef}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold uppercase tracking-wider text-primary"
            >
              About FoodFinder.AI
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-3 font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl text-balance"
            >
              Real-time, audit-ready food safety analysis.
            </motion.h2>

            {/* Word-by-word reveal paragraph */}
            <div className="mt-6 text-lg leading-relaxed font-light">
              {descriptionWords.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0.15 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.03,
                  }}
                  className="mr-[0.3em] inline-block text-muted-foreground"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-5">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={leftInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.12,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column — stats + schema */}
          <div ref={rightRef} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={rightInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  className="rounded-2xl border border-border/60 bg-background p-6 text-center"
                >
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={rightInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="rounded-2xl border border-border/60 bg-background p-6"
            >
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                Database Schema
              </h4>
              <div className="space-y-2 font-mono text-xs leading-relaxed text-muted-foreground">
                <p>
                  <span className="text-foreground font-semibold">users</span>{' '}
                  &mdash; id, email, created_at
                </p>
                <p>
                  <span className="text-foreground font-semibold">
                    user_preferences
                  </span>{' '}
                  &mdash; allergies[], dietary_preferences[], health_goals[]
                </p>
                <p>
                  <span className="text-foreground font-semibold">
                    scan_history
                  </span>{' '}
                  &mdash; product_name, risk_score, risk_level, conflicts
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
