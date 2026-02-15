import { useState, useEffect, useCallback } from 'react';
import { Leaf, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

const navLinks = [
  { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
  { label: 'Tech Stack', href: '#tech-stack', id: 'tech-stack' },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { user, signOut } = useUser();

  /* Active nav state: highlight section in view (landing only) */
  useEffect(() => {
    if (location.pathname !== '/') return;
    const sections = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          setActiveSection(id);
          break;
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setMobileOpen(false);
  }, [signOut]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            NutraSpec
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === '/' && activeSection === link.id;
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground truncate max-w-[160px]">
                {user.email}
              </span>
              <Link to="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Link to="/scan">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
                >
                  Scan
                </Button>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="flex flex-col gap-1.5 md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.span
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 8 : 0 }}
            className="block h-0.5 w-6 bg-foreground"
          />
          <motion.span
            animate={{ opacity: mobileOpen ? 0 : 1 }}
            className="block h-0.5 w-6 bg-foreground"
          />
          <motion.span
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -8 : 0 }}
            className="block h-0.5 w-6 bg-foreground"
          />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === '/' && activeSection === link.id;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground ${
                        isActive ? 'text-foreground font-semibold bg-accent/50' : 'text-muted-foreground'
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
              <li className="mt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <span className="px-3 text-sm text-muted-foreground truncate">
                      {user.email}
                    </span>
                    <Link to="/profile" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-muted-foreground w-full"
                      >
                        <User className="h-4 w-4 mr-1.5" />
                        Profile
                      </Button>
                    </Link>
                    <Link to="/scan" onClick={() => setMobileOpen(false)}>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-full"
                      >
                        Scan
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-muted-foreground"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-1.5" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-muted-foreground w-full"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setMobileOpen(false)}>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-full"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
