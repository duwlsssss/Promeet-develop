import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const locationStore = create()(
  devtools(
    immer((set) => ({
      location: null,
      nearestSubwayStation: null,
      allowMyLocation: true, // 임시 설정
      myLocation: null,
      actions: {
        setLocation: (value) =>
          set((state) => {
            state.location = value;
          }),
        setNearestSubwayStation: (value) =>
          set((state) => {
            state.nearestSubwayStation = value;
          }),
        setAllowMyLocation: (allow) =>
          set((state) => {
            state.allowMyLocation = allow;
          }),
        toggleAllowMyLocation: () =>
          set((state) => {
            state.allowMyLocation = !state.allowMyLocation;
          }),
        setMyLocation: (location) =>
          set((state) => {
            state.myLocation = location;
          }),
      },
    })),
  ),
);

export default locationStore;
