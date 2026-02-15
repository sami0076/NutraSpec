import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/** Faded hero background — same as Add_Ons (opacity 0.07, parallax) */
const HERO_BG_IMAGE = '/images/hero-food.jpeg';
const DEMO_IMAGE = '/images/Demo.jpg';

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
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Built at PatriotHacks 2026
              </div>
            </motion.div>

            <h1 className="mt-10 font-serif text-5xl leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl lg:leading-[1.1]">
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
              className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              Snap a photo of any ingredient label and get a personalized safety
              score based on your allergies, dietary preferences, and health goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:items-start"
            >
              <Link to="/scan">
                <Button
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-semibold gap-2 sm:w-auto"
                >
                  Start Scanning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full px-8 py-6 text-base font-semibold border-border text-foreground hover:bg-accent sm:w-auto"
                >
                  See How It Works
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Right: iPhone 17–style device mockup (thin bezel ~10%, 3D effect) */}
          <div ref={cardsRef} className="flex justify-center pb-16 lg:justify-end lg:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              className="w-full max-w-[325px] sm:max-w-[350px]"
              style={{ perspective: 800, transformStyle: 'preserve-3d' }}
            >
              {/* Thin bezel (~10%): screen occupies ~90%, 3D tilt; hover → straight + 5% scale */}
              <motion.div
                initial={false}
                animate={{ rotateY: -8, rotateX: 4, scale: 1 }}
                whileHover={{ rotateY: 0, rotateX: 0, scale: 1.05 }}
                transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
                className="rounded-[3.125rem] border-[2.5px] border-zinc-600 bg-zinc-800 p-[5%]"
                style={{
                  boxShadow:
                    '0 4px 6px rgba(0,0,0,0.2), 0 20px 40px rgba(0,0,0,0.25), 0 40px 80px -20px rgba(0,0,0,0.35), 2px 4px 0 rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.5rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                  <img
                    src={DEMO_IMAGE}
                    alt="NutraSpec app — scan a label, see your safety score"
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
