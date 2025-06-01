import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const userStore = create()(
  devtools(
    persist(
      immer((set) => ({
        userId: null,
        userName: null,
        fixedSchedules: [],
        promises: {
          create: [],
          join: [],
        },
        actions: {
          setUserId: (userId) =>
            set((state) => {
              state.userId = userId;
            }),
          setUserName: (name) =>
            set((state) => {
              state.userName = name;
            }),
          setFixedSchedules: (schedules) =>
            set((state) => {
              state.fixedSchedules = schedules;
            }),
          setPromises: (promises) =>
            set((state) => {
              state.promises = promises;
            }),
          clearUser: () =>
            set((state) => {
              state.userId = null;
              state.userName = null;
              state.fixedSchedules = [];
              state.promises = { create: [], join: [] };
            }),
        },
      })),
      {
        name: 'user-storage', // localStorage에 저장될 키 이름
        partialize: (state) => ({
          userId: state.userId,
        }),
      },
    ),
  ),
);

export default userStore;
