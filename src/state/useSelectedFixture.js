import { create } from "zustand";

export const useSelectedFixture = create((set) => ({
  selected: null,   // εδώ αποθηκεύουμε την κάρτα που πάτησε ο χρήστης

  setSelected: (fixture) => set({ selected: fixture }),

  clearSelected: () => set({ selected: null }),
}));
