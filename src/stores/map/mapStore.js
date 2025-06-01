import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const mapStore = create()(
  devtools(
    immer((set) => ({
      map: null,
      isKakaoLoaded: false,
      actions: {
        setMap: (map) =>
          set((state) => {
            state.map = map;
          }),
        setIsKakaoLoaded: (flag) =>
          set((state) => {
            state.isKakaoLoaded = flag;
          }),
      },
    })),
  ),
);

export default mapStore;
