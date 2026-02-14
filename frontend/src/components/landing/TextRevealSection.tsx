import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PARAGRAPH =
  'We help you eat with confidence. Every ingredient is checked against your allergies and goals. Know exactly what is in your food before it goes on your plate.';

export function TextRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = PARAGRAPH.split(' ');

  return (
    <section
      id="text-reveal"
      ref={containerRef}
      className="relative min-h-[150vh] py-24 md:py-32"
    >
      <div className="sticky top-0 flex min-h-screen items-center">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-12 flex items-start gap-6 md:gap-12">
            <div className="flex-1">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">
                Our promise
              </p>
              <h2 className="font-serif text-3xl leading-tight text-foreground md:text-5xl">
                Slow word
                <br />
                <span className="text-muted-foreground">reveal</span>
              </h2>
            </div>
          </div>

          <div className="max-w-4xl">
            <p className="flex flex-wrap font-serif text-2xl leading-relaxed md:text-4xl md:leading-[1.4] lg:text-5xl lg:leading-[1.3]">
              {words.map((word, i) => (
                <Word
                  key={`${word}-${i}`}
                  word={word}
                  range={[i / words.length, (i + 1) / words.length]}
                  progress={scrollYProgress}
                />
              ))}
            </p>
          </div>

          <p className="mt-10 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Each word fades in as you scroll for a clear, focused reading experience.
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);

  return (
    <span className="relative mr-[0.25em] mt-1">
      <span className="opacity-10">{word}</span>
      <motion.span
        style={{ opacity }}
        className="absolute left-0 top-0 text-foreground"
      >
        {word}
      </motion.span>
    </span>
  );
}
