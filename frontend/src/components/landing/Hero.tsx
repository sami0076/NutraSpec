import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/** Faded hero background — same as Add_Ons (opacity 0.07, parallax) */
const HERO_BG_IMAGE = '/images/hero-food.jpeg';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const headlineLine1 = ['Know', 'exactly'];
  const headlineLine2 = ["what's", 'in', 'your', 'food.'];

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-28 pb-0">
      {/* Parallax background image */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
        style={{ y: heroImageY, scale: heroImageScale }}
      >
        <img
          src={HERO_BG_IMAGE}
          alt=""
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] grain"
        aria-hidden
      />

      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto max-w-7xl px-6"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Built at PatriotHacks 2026
          </div>
        </motion.div>

        {/* Headline with staggered word reveal */}
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <h1 className="font-serif text-5xl leading-tight tracking-tight text-foreground md:text-7xl md:leading-[1.1]">
            {headlineLine1.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.12 }}
                className="mr-[0.3em] inline-block"
              >
                {word}
              </motion.span>
            ))}
            <br />
            {headlineLine2.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 + i * 0.12 }}
                className="mr-[0.3em] inline-block"
              >
                {word === "what's" ? (
                  <span className="text-primary">{"what's"}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Snap a photo of any ingredient label and get a personalized safety
            score based on your allergies, dietary preferences, and health goals.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
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
                className="rounded-full px-8 py-6 text-base font-semibold border-border text-foreground hover:bg-accent"
              >
                See How It Works
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Feature preview cards with stagger + parallax entrance */}
        <div ref={cardsRef} className="mx-auto mt-20 max-w-3xl pb-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: Camera,
                title: 'Scan Label',
                desc: 'Point your camera at any ingredient list',
              },
              {
                icon: ShieldCheck,
                title: 'Safety Score',
                desc: '82',
                isScore: true,
              },
              {
                icon: ShieldCheck,
                title: 'Safe for You',
                desc: 'Personalized to your dietary profile',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 60 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="group flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-8 text-center transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary/10">
                  <card.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {card.title}
                </h3>
                {card.isScore ? (
                  <div className="mt-3 flex flex-col items-center">
                    <div className="relative h-16 w-16">
                      <svg
                        className="h-16 w-16 -rotate-90"
                        viewBox="0 0 64 64"
                      >
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="hsl(var(--color-border))"
                          strokeWidth="4"
                        />
                        <motion.circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="hsl(var(--color-primary))"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={175.9}
                          initial={{ strokeDashoffset: 175.9 }}
                          animate={
                            cardsInView
                              ? { strokeDashoffset: 175.9 * (1 - 0.82) }
                              : {}
                          }
                          transition={{
                            duration: 1.5,
                            delay: 0.6,
                            ease: 'easeOut',
                          }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
                        {card.desc}
                      </span>
                    </div>
                    <span className="mt-2 rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">
                      LOW Risk
                    </span>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {card.desc}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
