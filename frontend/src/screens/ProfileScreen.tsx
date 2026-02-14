import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Save, Plus, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { useUserProfile } from '@/hooks/useUserProfile';

/** Preset options for the multi-select fields. */
const ALLERGY_OPTIONS = [
  'peanuts', 'tree_nuts', 'milk', 'eggs', 'wheat', 'soy', 'fish',
  'shellfish', 'sesame', 'corn', 'sulfites',
];
const DIET_OPTIONS = [
  'vegan', 'vegetarian', 'gluten_free', 'dairy_free', 'keto',
  'paleo', 'halal', 'kosher', 'low_sodium',
];
const CONDITION_OPTIONS = [
  'diabetes', 'hypertension', 'celiac_disease', 'ibs',
  'kidney_disease', 'heart_disease', 'gout',
];
const GOAL_OPTIONS = [
  'weight_loss', 'muscle_gain', 'clean_eating', 'low_sugar',
  'high_protein', 'heart_health', 'gut_health',
];

function TagSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (item: string) => {
    onChange(
      selected.includes(item)
        ? selected.filter((s) => s !== item)
        : [...selected, item],
    );
  };

  const [custom, setCustom] = useState('');
  const addCustom = () => {
    const val = custom.trim().toLowerCase().replace(/\s+/g, '_');
    if (val && !selected.includes(val)) {
      onChange([...selected, val]);
    }
    setCustom('');
  };

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/30'
              }`}
            >
              {opt.replace(/_/g, ' ')}
              {active && <X className="ml-1.5 inline h-3 w-3" />}
            </button>
          );
        })}
      </div>
      {/* Custom entry */}
      <div className="mt-2 flex items-center gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCustom()}
          placeholder={`Add custom ${label.toLowerCase()}...`}
          className="h-8 flex-1 rounded-lg border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          onClick={addCustom}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent"
        >
          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
      {/* Show custom selections not in presets */}
      {selected.filter((s) => !options.includes(s)).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected
            .filter((s) => !options.includes(s))
            .map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full border border-primary bg-primary/10 px-2.5 py-0.5 text-xs text-primary"
              >
                {s.replace(/_/g, ' ')}
                <button onClick={() => toggle(s)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
        </div>
      )}
    </div>
  );
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, userId, loading: authLoading, signOut, signInWithGoogle } = useUser();
  const { profile, loading, error, loadProfile, saveProfile } = useUserProfile();

  const [allergies, setAllergies] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  // Load profile when authenticated
  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId, loadProfile]);

  // Sync profile data to local state
  useEffect(() => {
    if (profile) {
      setAllergies(profile.allergies);
      setDietaryRestrictions(profile.dietary_restrictions);
      setHealthConditions(profile.health_conditions);
      setHealthGoals(profile.health_goals);
    }
  }, [profile]);

  const handleSave = useCallback(async () => {
    if (!userId) return;
    setSaved(false);
    const ok = await saveProfile({
      allergies,
      dietary_restrictions: dietaryRestrictions,
      health_conditions: healthConditions,
      health_goals: healthGoals,
    });
    if (ok) setSaved(true);
  }, [userId, allergies, dietaryRestrictions, healthConditions, healthGoals, saveProfile]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">
              FoodFinder<span className="text-primary">.AI</span>
            </span>
          </div>
          <Link
            to="/scan"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Scan
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-light text-foreground font-serif md:text-3xl">
              Your Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Customize your dietary profile for personalized risk scoring.
            </p>
          </div>
        </div>

        {/* Not authenticated — prompt to sign in */}
        {!user ? (
          <div className="rounded-xl border border-border/60 bg-card p-6 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Sign in required
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sign in with Google to save and load your dietary profile for personalized risk scoring.
            </p>
            <Button
              onClick={() => signInWithGoogle()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6"
            >
              Sign in with Google
            </Button>
          </div>
        ) : (
          /* Authenticated — show user info and profile form */
          <>
            <div className="rounded-xl border border-border/60 bg-card p-4 mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-semibold text-foreground">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>

            <div className="space-y-8">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <TagSelect
                label="Allergies"
                options={ALLERGY_OPTIONS}
                selected={allergies}
                onChange={setAllergies}
              />

              <TagSelect
                label="Dietary Restrictions"
                options={DIET_OPTIONS}
                selected={dietaryRestrictions}
                onChange={setDietaryRestrictions}
              />

              <TagSelect
                label="Health Conditions"
                options={CONDITION_OPTIONS}
                selected={healthConditions}
                onChange={setHealthConditions}
              />

              <TagSelect
                label="Health Goals"
                options={GOAL_OPTIONS}
                selected={healthGoals}
                onChange={setHealthGoals}
              />

              {/* Save */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-5 text-base font-semibold gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
                {saved && (
                  <span className="text-sm text-green-600 font-medium">
                    Profile saved successfully!
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
