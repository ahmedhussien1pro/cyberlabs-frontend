// src/features/dashboard/store/dashboard.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DashboardStore } from '../types';

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      // State
      sidebarCollapsed: false,
      sidebarOpen: false,
      activeView: 'grid',

      // Actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setActiveView: (view) => set({ activeView: view }),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        activeView: state.activeView,
      }),
    },
  ),
);
