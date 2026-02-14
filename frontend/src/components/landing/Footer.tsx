import { ArrowUp, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to top
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>

        {/* Center */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <UtensilsCrossed className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              FoodFinder<span className="text-primary">.AI</span>
            </span>
          </div>
          <Link
            to="/profile"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Settings
          </Link>
        </div>

        {/* Right */}
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} FoodFinder.AI — PatriotHacks 2026
        </p>
      </div>
    </footer>
  )
}
