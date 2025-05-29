import { create } from 'zustand';

const useMarkerStore = create((set) => ({
  activeMarkerId: null,
  setActiveMarkerId: (markerId) => set({ activeMarkerId: markerId }),
  clearActiveMarkerId: () => set({ activeMarkerId: null }),
}));

export default useMarkerStore;
