import { create } from 'zustand';

const useMapStore = create((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));

export default useMapStore;
