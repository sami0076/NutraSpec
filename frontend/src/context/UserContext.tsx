import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

type UserContextValue = {
  userId: string | null;
  setUserId: (id: string | null) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const value = useMemo(() => ({ userId, setUserId }), [userId]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
