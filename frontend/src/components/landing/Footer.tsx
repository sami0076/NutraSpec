import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const footerLinks = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Tech Stack', href: '#tech-stack' },
      { label: 'About', href: '#about' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Setup Guide', href: '#' },
      { label: 'FAQ', href: '#' },
    ],
  },
  {
    heading: 'Project',
    links: [
      { label: 'About', href: '#about' },
      { label: 'PatriotHacks', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-6">
          {/* Brand column */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-foreground">
                NutraSpec
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground"
            >
              AI-powered ingredient risk scoring. Snap a photo, get a
              personalized safety analysis. Built at PatriotHacks 2026.
            </motion.p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group, i) => (
            <motion.div
              key={group.heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row"
        >
          <p className="text-sm text-muted-foreground">
            &copy; 2026 NutraSpec. Built at PatriotHacks.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Discord"
            >
              Discord
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
