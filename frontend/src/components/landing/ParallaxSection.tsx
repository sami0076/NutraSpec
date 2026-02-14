import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PARALLAX_IMAGES = [
  { src: '/images/Scan_Label.jpeg', alt: 'Food label ingredients' },
  { src: '/images/Ingredients.jpeg', alt: 'Healthy ingredients' },
];

export function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -120]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.05, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section
      id="parallax"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden py-24 md:py-32"
    >
      <div className="mx-auto mb-16 max-w-6xl px-6 lg:px-8">
        <div className="flex items-start gap-6 md:gap-12">
          <div className="flex-1">
            <motion.p
              style={{ opacity }}
              className="mb-3 text-xs uppercase tracking-[0.3em] text-primary"
            >
              Scan to score
            </motion.p>
            <motion.h2
              style={{ opacity }}
              className="font-serif text-3xl leading-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Labels in
              <br />
              <span className="text-muted-foreground">motion</span>
            </motion.h2>
            <motion.p
              style={{ opacity }}
              className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground"
            >
              As you scroll, visuals move at different speeds for a sense of depth — a preview of the focus we put on every ingredient.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            style={{ y: y1, scale }}
            className="relative aspect-[3/4] overflow-hidden rounded-xl"
          >
            <img
              src={PARALLAX_IMAGES[0].src}
              alt={PARALLAX_IMAGES[0].alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-background/20" />
          </motion.div>
          <motion.div
            style={{ y: y2, scale }}
            className="relative mt-20 aspect-[3/4] overflow-hidden rounded-xl md:mt-28"
          >
            <img
              src={PARALLAX_IMAGES[1].src}
              alt={PARALLAX_IMAGES[1].alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-background/20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
