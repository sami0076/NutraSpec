import { useState, useCallback } from 'react';
import { fetchProfile, updateProfile, type ProfileUpdatePayload } from '@/services/userService';
import type { UserProfile } from '@/types/userTypes';
import { toErrorMessage } from '@/utils/errorHandler';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  loadProfile: () => Promise<void>;
  saveProfile: (payload: ProfileUpdatePayload) => Promise<boolean>;
}

/**
 * Hook for loading + updating user dietary profile.
 * The user is identified by the Supabase JWT (no explicit userId needed).
 */
export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (payload: ProfileUpdatePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateProfile(payload);
      setProfile(data);
      return true;
    } catch (err) {
      setError(toErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, loadProfile, saveProfile };
}
