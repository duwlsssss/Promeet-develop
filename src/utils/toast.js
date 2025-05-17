import useToastStore from '../stores/ui/useToastStore';

const toast = (message) => {
  const store = useToastStore.getState();
  // 이미 토스트가 표시 중이라면 새로운 요청 무시
  if (store.isOpen) {
    return;
  }
  store.show(message);
};

// 토스트를 강제 종료하는 함수
export const closeToast = () => {
  const store = useToastStore.getState();
  store.close();
};

export default toast;
