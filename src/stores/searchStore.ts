import { create } from 'zustand';

interface SearchItem {
  id: string;
  title: string;
  type: 'course' | 'lab' | 'path';
  url: string;
}

interface SearchStore {
  isOpen: boolean;
  query: string;
  results: SearchItem[];
  setIsOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setResults: (results: SearchItem[]) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  query: '',
  results: [],
  setIsOpen: (open) => set({ isOpen: open }),
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  clearSearch: () => set({ query: '', results: [] }),
}));
