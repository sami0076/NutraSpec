import { motion } from 'framer-motion';

export function SectionDivider() {
  return (
    <div className="flex justify-center px-6">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className="h-px w-full max-w-5xl origin-left bg-border"
      />
    </div>
  );
}
