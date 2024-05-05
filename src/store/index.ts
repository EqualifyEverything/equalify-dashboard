import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createAuthSlice } from './slices/authSlice';
import { createFilterSlice } from './slices/filterSlice';

type StoreState = ReturnType<typeof createAuthSlice> &
  ReturnType<typeof createFilterSlice>;

export const useStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createFilterSlice(...args),
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
