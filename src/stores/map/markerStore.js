import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const markerStore = create()(
  devtools(
    immer((set) => ({
      activeMarkerId: null,
      actions: {
        setActiveMarkerId: (markerId) =>
          set((state) => {
            state.activeMarkerId = markerId;
          }),
        clearActiveMarkerId: () =>
          set((state) => {
            state.activeMarkerId = null;
          }),
      },
    })),
  ),
);

export default markerStore;
