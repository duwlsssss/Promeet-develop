import { useShallow } from 'zustand/shallow';
import locationStore from '@/stores/promise/locationStore';

export const useLocationInfo = () =>
  locationStore(
    useShallow((state) => ({
      location: state.location,
      nearestSubwayStation: state.nearestSubwayStation,
      allowMyLocation: state.allowMyLocation,
      myLocation: state.myLocation,
    })),
  );

export const useLocationActions = () => locationStore((state) => state.actions);
