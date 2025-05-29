import { useEffect } from 'react';
import useLocationStore from '@/stores/promise/useLocationStore';

const SubwayCategoryCode = 'SW8';

const useNearestSubwayStation = (lat, lng) => {
  const { setNearestSubwayStation } = useLocationStore();

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !lat || !lng) return;

    const ps = new window.kakao.maps.services.Places();
    const position = new window.kakao.maps.LatLng(lat, lng);

    ps.categorySearch(
      SubwayCategoryCode,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
          // 가장 가까운 역
          const nearestStation = data[0];
          setNearestSubwayStation({
            name: nearestStation.place_name,
            position: {
              lat: nearestStation.y,
              lng: nearestStation.x,
            },
            id: nearestStation.id,
            distance: nearestStation.distance,
          });
        }
      },
      {
        position,
        radius: 2000, // 반경 2km 안에서 검색
        sort: window.kakao.maps.services.SortBy.DISTANCE, // 거리순 정렬
      },
    );
  }, [lat, lng, setNearestSubwayStation]);
};

export default useNearestSubwayStation;
