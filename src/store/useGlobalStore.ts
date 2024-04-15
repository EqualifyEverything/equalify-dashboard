import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useGlobalStore = create(
    persist(
        (set) => ({
            loading: false,
            setLoading: (value) => set(() => ({ loading: value })),
        }), {
        name: 'equalify-storage',
        partialize: (state) => ({
        })
    })
);