import { StateCreator } from 'zustand';

export interface Filter {
  label: string;
  value: string;
  type: string;
}

interface FilterSlice {
  selectedFilters: Filter[];
  addFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
  clearFilters: () => void;
}

export const createFilterSlice: StateCreator<FilterSlice> = (set) => ({
  selectedFilters: [],
  addFilter: (filter) =>
    set((state) => ({
      selectedFilters: [...state.selectedFilters, filter],
    })),
  removeFilter: (filter) =>
    set((state) => ({
      selectedFilters: state.selectedFilters.filter(
        (f) => f.label !== filter.label || f.value !== filter.value,
      ),
    })),
  clearFilters: () => set({ selectedFilters: [] }),
});
