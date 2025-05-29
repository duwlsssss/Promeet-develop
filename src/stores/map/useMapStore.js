import { create } from 'zustand';

const useMapStore = create((set) => ({
  map: null,
  setMap: (map) => set({ map }),
  isKakaoLoaded: false,
  setIsKakaoLoaded: (flag) => set({ isKakaoLoaded: flag }),
}));

export default useMapStore;
