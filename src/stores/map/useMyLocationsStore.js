import { create } from 'zustand';

const useMyLocation = create((set) => ({
  // allowMyLocation: false,
  allowMyLocation: true, // 임시
  setAllowMyLocation: (allowMyLocation) =>
    set({
      allowMyLocation: !allowMyLocation,
    }),
  myLocation: null,
  setMyLocation: (location) =>
    set({
      myLocation: location,
    }),
}));

export default useMyLocation;
