import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const markerStore = create()(
  devtools(
    immer((set) => ({
      activeMarkerId: null,
      actions: {
        setActiveMarkerId: (markerId) => set({ activeMarkerId: markerId }),
        clearActiveMarkerId: () => set({ activeMarkerId: null }),
      },
    })),
  ),
);

export default markerStore;
