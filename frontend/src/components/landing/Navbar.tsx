import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between rounded-full border border-border/50 px-4 py-2.5 transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-white/60 backdrop-blur-md'
      )}
      style={{ width: 'min(90vw, 560px)' }}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-bold text-foreground">
          FoodFinder<span className="text-primary">.AI</span>
        </span>
      </div>

      <Link
        to="/scan"
        className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Scan Now
      </Link>
    </nav>
  )
}
