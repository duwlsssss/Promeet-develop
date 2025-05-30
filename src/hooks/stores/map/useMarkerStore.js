import markerStore from '@/stores/map/markerStore';
import { useShallow } from 'zustand/shallow';

export const useMarkerInfo = () =>
  markerStore(
    useShallow((state) => ({
      activeMarkerId: state.activeMarkerId,
    })),
  );

export const useMarkerActions = () => markerStore((state) => state.actions);
