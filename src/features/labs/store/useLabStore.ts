import { create } from 'zustand';

interface LabState {
  isLabRunning: boolean;
  labUrl: string | null;
  labId: string | null;
  startLab: (id: string, url: string) => void;
  stopLab: () => void;
}

export const useLabStore = create<LabState>((set) => ({
  isLabRunning: false,
  labUrl: null,
  labId: null,
  startLab: (id, url) => set({ isLabRunning: true, labId: id, labUrl: url }),
  stopLab: () => set({ isLabRunning: false, labId: null, labUrl: null }),
}));
