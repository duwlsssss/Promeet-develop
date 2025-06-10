import { useEffect } from 'react';
import { usePromiseDataActions } from '@/hooks/stores/promise/usePromiseDataStore';

const SubwayCategoryCode = 'SW8';

const useNearestSubwayStation = (lat, lng) => {
  const { setNearestSubwayStation } = usePromiseDataActions();

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !lat || !lng) return;

    console.log(lat, lng);
    const ps = new window.kakao.maps.services.Places();
    const location = new window.kakao.maps.LatLng(lat, lng);

    ps.categorySearch(
      SubwayCategoryCode,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
          // 가장 가까운 역
          const nearestStation = data[0];
          setNearestSubwayStation({
            id: nearestStation.id,
            name: nearestStation.place_name,
            position: {
              Ma: nearestStation.y,
              La: nearestStation.x,
            },
            address: nearestStation.address,
            distance: nearestStation.distance,
          });
        }
      },
      {
        location,
        radius: 2000, // 반경 2km 안에서 검색
        sort: window.kakao.maps.services.SortBy.DISTANCE, // 거리순 정렬
      },
    );
  }, [lat, lng, setNearestSubwayStation]);
};

export default useNearestSubwayStation;
