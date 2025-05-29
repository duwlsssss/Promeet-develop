import { create } from 'zustand';

const useTabsStore = create((set) => ({
  selectedValue: '',
  setSelectedValue: (value) => set({ selectedValue: value }),
  option: '',
  setOption: (value) => set({ option: value }),
}));

export default useTabsStore;
