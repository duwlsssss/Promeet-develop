import mapStore from '@/stores/map/mapStore';
import { useShallow } from 'zustand/shallow';

export const useMapInfo = () =>
  mapStore(
    useShallow((state) => ({
      map: state.map,
      isKakaoLoaded: state.isKakaoLoaded,
    })),
  );

export const useMapActions = () => mapStore((state) => state.actions);
