import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/** Your images — single set with extra space between cards */
const SLIDE_IMAGES = [
  { src: '/images/hero-food.jpeg', label: 'Fresh Ingredients' },
  { src: '/images/Scan_Label.jpeg', label: 'Scan Labels' },
  { src: '/images/Ingredients.jpeg', label: 'Identify Risks' },
];

/** PowerPoint-style 3D: each card rotateY (trapezoid) + translateZ (recede). Left, center, right. */
const CARD_3D = [
  { rotateY: -42, translateZ: -100 },
  { rotateY: 0, translateZ: 0 },
  { rotateY: 42, translateZ: -100 },
];

export function SlidingGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0.2, 0.85], [120, -280]);
  const rotateY = useTransform(scrollYProgress, [0.2, 0.85], [-14, 14]);

  return (
    <section
      id="sliding-gallery"
      ref={containerRef}
      className="relative overflow-hidden py-24"
    >
      {/* Tighter perspective = stronger trapezoid/receding effect (PowerPoint-like) */}
      <div
        className="min-h-[320px] w-full"
        style={{
          perspective: '900px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <motion.div
          style={{
            x,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="flex gap-[15rem] px-6"
        >
          {SLIDE_IMAGES.map((img, i) => (
            <motion.div
              key={img.label}
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${CARD_3D[i].rotateY}deg) translateZ(${CARD_3D[i].translateZ}px)`,
                backfaceVisibility: 'hidden',
              }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group relative h-64 w-80 shrink-0 overflow-hidden rounded-2xl md:h-80 md:w-[420px]"
          >
            <img
              src={img.src}
              alt={img.label}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Cream overlay — matches Add_Ons theme */}
            <div className="absolute inset-0 bg-[hsl(43,58%,93%)]/30" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[hsl(0,90%,15%)]/60 to-transparent p-6">
              <p className="text-sm font-medium text-[hsl(43,58%,93%)]">
                {img.label}
              </p>
            </div>
          </motion.div>
        ))}
        </motion.div>
      </div>
    </section>
  );
}
