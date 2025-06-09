import { useShallow } from 'zustand/shallow';
import promiseDataStore from '@/stores/promise/promiseDataStore';

export const usePromiseDataInfo = () =>
  promiseDataStore(
    useShallow((state) => ({
      name: state.name,
      description: state.description,
      memberCnt: state.memberCnt,
      availableTimes: state.availableTimes,
      nearestSubwayStation: state.nearestSubwayStation,
      members: state.members,
      routes: state.routes,
      likedPlaces: state.likedPlaces,
      fixedPlace: state.fixedPlace,
    })),
  );

export const usePromiseDataActions = () => promiseDataStore((state) => state.actions);
