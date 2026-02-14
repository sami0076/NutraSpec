import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/** Your images — sliding gallery same style as Add_Ons (scroll-driven x, cream overlay, labels) */
const SLIDE_IMAGES = [
  { src: '/images/hero-food.jpeg', label: 'Fresh Ingredients' },
  { src: '/images/Scan_Label.jpeg', label: 'Scan Labels' },
  { src: '/images/Ingredients.jpeg', label: 'Identify Risks' },
];

export function SlidingGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  /* Same scroll-driven motion as Add_Ons ff-sliding-gallery */
  const x = useTransform(scrollYProgress, [0, 1], [200, -400]);

  return (
    <section
      id="sliding-gallery"
      ref={containerRef}
      className="relative overflow-hidden py-20"
    >
      <motion.div style={{ x }} className="flex gap-6 px-6">
        {SLIDE_IMAGES.map((img, i) => (
          <motion.div
            key={img.label}
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
    </section>
  );
}
