import { StateCreator } from 'zustand';

interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthSlice {
  user: AuthUser | null;
  isAuthenticated: boolean;
  needsConfirmation: boolean;
  pendingUsername: string | null;
  loading: boolean;
  error: Error | null;
  setUser: (user: AuthUser | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setNeedsConfirmation: (needsConfirmation: boolean) => void;
  setPendingUsername: (pendingUsername: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  clearAuth: () => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [],
  [['zustand/persist', AuthSlice]]
> = (set) => ({
  user: null,
  isAuthenticated: false,
  needsConfirmation: false,
  pendingUsername: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setNeedsConfirmation: (needsConfirmation) => set({ needsConfirmation }),
  setPendingUsername: (pendingUsername) => set({ pendingUsername }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearAuth: () => set({ isAuthenticated: false, user: null, error: null }),
});
