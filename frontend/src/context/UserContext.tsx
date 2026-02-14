import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AuthContextValue {
  /** Supabase user object (null when logged out). */
  user: User | null;
  /** Convenience shorthand – the Supabase user UUID. */
  userId: string | null;
  /** Current session (contains access_token). */
  session: Session | null;
  /** True while the initial session is being restored. */
  loading: boolean;

  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;

  /** Legacy setter kept for backward compatibility — no-op with real auth. */
  setUserId: (id: string | null) => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const AuthContext = createContext<AuthContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---- Restore session on mount & listen for auth changes ---- */

  useEffect(() => {
    // Use onAuthStateChange as the SOLE source of truth.
    // It fires an INITIAL_SESSION event first (which correctly handles
    // OAuth redirect hash tokens), then SIGNED_IN / SIGNED_OUT / etc.
    // This avoids the race condition where getSession() resolves before
    // the URL hash tokens are processed after a Google OAuth redirect.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ---- Auth actions ---- */

  const signInWithGoogle = useCallback(async (): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth',
      },
    });
    return error ? error.message : null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  /* ---- Context value ---- */

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      userId: user?.id ?? null,
      session,
      loading,
      signInWithGoogle,
      signOut,
      setUserId: () => {},  // no-op — userId now comes from Supabase
    }),
    [user, session, loading, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useUser(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
