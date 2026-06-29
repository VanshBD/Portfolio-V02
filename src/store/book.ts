import { create } from "zustand";

interface BookStore {
  currentSection: number;
  setSection: (n: number) => void;
}

export const useBookStore = create<BookStore>((set) => ({
  currentSection: 0,
  setSection: (n) => set({ currentSection: n }),
}));
