import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createAuthSlice } from './slices/authSlice';

type StoreState = ReturnType<typeof createAuthSlice>;

export const useStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
    }),
    {
      name: 'equalify-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        needsConfirmation: state.needsConfirmation,
        pendingUsername: state.pendingUsername,
        user: state.user,
      }),
    },
  ),
);
