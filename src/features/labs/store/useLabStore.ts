import { create } from 'zustand';

interface LabState {
  isLabRunning: boolean;
  labUrl: string | null;
  labId: string | null;
  instanceId: string | null;
  isLaunching: boolean; // ← for loading state on card button
  startLab: (id: string, url: string, instanceId: string) => void;
  stopLab: () => void;
  setLaunching: (v: boolean) => void;
}

export const useLabStore = create<LabState>((set) => ({
  isLabRunning: false,
  labUrl: null,
  labId: null,
  instanceId: null,
  isLaunching: false,
  startLab: (id, url, instanceId) =>
    set({
      isLabRunning: true,
      labId: id,
      labUrl: url,
      instanceId,
      isLaunching: false,
    }),
  stopLab: () =>
    set({ isLabRunning: false, labId: null, labUrl: null, instanceId: null }),
  setLaunching: (v) => set({ isLaunching: v }),
}));
