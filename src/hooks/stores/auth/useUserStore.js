import userStore from '@/stores/auth/userStore';
import { useShallow } from 'zustand/shallow';

export const useUserInfo = () =>
  userStore(
    useShallow((state) => ({
      userId: state.userId,
      userName: state.userName,
      fixedSchedules: state.fixedSchedules,
      promises: state.promises,
    })),
  );

export const useUserActions = () => userStore((state) => state.actions);
