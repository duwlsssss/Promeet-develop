import { create } from 'zustand';

const useLocationStore = create((set) => ({
  location: null,
  setLocation: (value) =>
    set({
      location: value,
    }),
  nearestSubwayStation: null,
  setNearestSubwayStation: (value) =>
    set({
      nearestSubwayStation: value,
    }),
}));

export default useLocationStore;
