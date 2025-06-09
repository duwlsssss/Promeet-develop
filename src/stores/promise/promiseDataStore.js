import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const initialState = {
  name: '',
  description: '',
  memberCnt: 2,
  availableTimes: [],
  nearestSubwayStation: null,
  members: [],
  routes: [],
  likedPlaces: [],
  fixedPlace: null,
};

const promiseDataStore = create()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        actions: {
          setName: (name) =>
            set((state) => {
              state.name = name;
            }),
          setDescription: (description) =>
            set((state) => {
              state.description = description;
            }),
          setMemberCnt: (memberCnt) =>
            set((state) => {
              state.memberCnt = memberCnt;
            }),
          setAvailableTimes: (availableTimes) =>
            set((state) => {
              state.availableTimes = availableTimes;
            }),
          setNearestSubwayStation: (value) =>
            set((state) => {
              state.nearestSubwayStation = value;
            }),
          setMembers: (members) =>
            set((state) => {
              state.members = members;
            }),
          setRoutes: (routes) =>
            set((state) => {
              state.routes = routes;
            }),
          setLikedPlaces: (places) =>
            set((state) => {
              state.likedPlaces = places;
            }),
          setFixedPlace: (place) =>
            set((state) => {
              state.fixedPlace = place;
            }),
          // 특정 단계까지의 데이터가 있는지 체크
          hasDataUntil: (step) => {
            const state = get();
            const InfoState = !!state.name && !!state.description;
            switch (step) {
              case 'date':
                return InfoState;
              case 'location':
                return InfoState && !!state.availableTimes.length;
              case 'schedule':
                return InfoState && !!state.availableTimes.length && !!state.nearestSubwayStation;
              default:
                return false;
            }
          },
          hasNearestSubwayStationData: () => !!get().nearestSubwayStation,

          // 모든 데이터 초기화
          reset: () => set(initialState),
        },
      })),
      {
        name: 'promise-create-data',
        partialize: (state) => ({
          name: state.name,
          description: state.description,
          memberCnt: state.memberCnt,
          availableTimes: state.availableTimes,
          nearestSubwayStation: state.nearestSubwayStation,
        }),
      },
    ),
  ),
);

export default promiseDataStore;
