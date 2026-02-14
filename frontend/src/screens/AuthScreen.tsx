import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';

/** Inline Google "G" logo as SVG — no external dependency needed. */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function AuthScreen() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGoogle } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in (or after OAuth callback)
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/scan');
    }
  }, [user, authLoading, navigate]);

  const handleGoogleSignIn = useCallback(async () => {
    setError(null);
    setLoading(true);
    const err = await signInWithGoogle();
    if (err) {
      setError(err);
      setLoading(false);
    }
    // On success the page will redirect to Google — no need to setLoading(false)
  }, [signInWithGoogle]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      {/* Logo */}
      <Link to="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          FoodFinder<span className="text-primary">.AI</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card p-8 shadow-lg shadow-primary/5">
        <h1 className="text-2xl font-light text-foreground font-serif text-center">
          Welcome to FoodFinder.AI
        </h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Sign in to access personalized ingredient risk scoring, save your
          dietary profile, and track your scan history.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Google OAuth button */}
        <div className="mt-8">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full rounded-full border-border py-5 text-base font-semibold text-foreground hover:bg-accent gap-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                Redirecting...
              </span>
            ) : (
              <>
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            By signing in you agree to our terms of use. We only access your
            name and email from Google — nothing else.
          </p>
        </div>
      </div>

      {/* Skip for now */}
      <Link
        to="/scan"
        className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Continue without an account
      </Link>
    </div>
  );
}
