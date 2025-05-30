import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const mapStore = create()(
  devtools(
    immer((set) => ({
      map: null,
      isKakaoLoaded: false,
      actions: {
        setMap: (map) => set(() => ({ map }), false, 'setMap'),
        setIsKakaoLoaded: (flag) => set(() => ({ isKakaoLoaded: flag }), false, 'setIsKakaoLoaded'),
      },
    })),
  ),
);

export default mapStore;
