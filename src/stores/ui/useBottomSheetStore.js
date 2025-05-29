import { create } from 'zustand';

const useBottomSheetStore = create((set) => ({
  activeBottomSheet: null, // 처음엔 아무 BottomSheet도 열려 있지 않음
  setActiveBottomSheet: (sheet) => set({ activeBottomSheet: sheet }), // BottomSheet를 하나만 활성화
  bottomSheetHeight: 'auto', // 높이 기록해 사용
  setBottomSheetHeight: (height) => set({ bottomSheetHeight: height }),
}));

export default useBottomSheetStore;
