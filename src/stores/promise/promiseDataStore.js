import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const promiseDataStore = create()(
  devtools(
    immer((set) => ({
      // 임시 데이터
      routes: [
        {
          name: '김철수',
          userId: 'sss1341',
          route: [
            {
              station: {
                order: 1,
                type: 'normal',
                address: '서울특별시 강남구 강남대로 지하396',
                name: '강남역 2호선',
                position: {
                  La: 37.497175,
                  Ma: 127.027926,
                },
              },
              duration: 5,
            },
            {
              station: {
                order: 2,
                type: 'normal',
                address: '서울특별시 서초구 남부순환로 2196',
                name: '서초역 2호선',
                position: {
                  La: 37.49191,
                  Ma: 127.00798,
                },
              },
              duration: 5,
            },
            {
              station: {
                order: 3,
                type: 'normal',
                address: '서울특별시 관악구 남부순환로 1820',
                name: '서울대입구역 2호선',
                position: {
                  La: 37.481247,
                  Ma: 126.952739,
                },
              },
              duration: 6,
            },
          ],
        },
        {
          name: '이영희',
          userId: 'sss1342',
          route: [
            {
              station: {
                order: 1,
                type: 'normal',
                address: '서울특별시 구로구 경인로 572',
                name: '구로디지털단지역 2호선',
                position: {
                  La: 37.485013,
                  Ma: 126.901401,
                },
              },
              duration: 4,
            },
            {
              station: {
                order: 2,
                type: 'normal',
                address: '서울특별시 관악구 봉천로 310',
                name: '봉천역 2호선',
                position: {
                  La: 37.482416,
                  Ma: 126.941829,
                },
              },
              duration: 4,
            },
            {
              station: {
                order: 3,
                type: 'normal',
                address: '서울특별시 관악구 남부순환로 1820',
                name: '서울대입구역 2호선',
                position: {
                  La: 37.481247,
                  Ma: 126.952739,
                },
              },
              duration: 6,
            },
          ],
        },
      ],
      likedPlaces: [],
      fixedPlace: null,
      actions: {
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
      },
    })),
  ),
);

export default promiseDataStore;
