import * as S from './style';
import { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import PlaceCardList from '@/components/promise/place/PlaceCardList';
import PlaceLikeToggle from '@/components/promise/place/PlaceLikeToggle';
import MarkerManager from '../MarkerManager';
import BottomSheet from '@/components/ui/BottomSheet';
import { useMapInfo } from '@/hooks/stores/promise/map/useMapStore';
import { useUserInfo } from '@/hooks/stores/auth/useUserStore';
import { useLocationInfo } from '@/hooks/stores/promise/useLocationStore';
import { usePlaceLikeToggleInfo } from '@/hooks/stores/promise/usePlaceLikeToggleStore';
import { usePromiseDataInfo } from '@/hooks/stores/promise/usePromiseDataStore';
import { CATEGORY, CATEGORY_LABEL } from '@/constants/place';
import { DEFAULT_SUBWAY_STATION } from '@/constants/promise';
import { MAP_BS_ID } from '@/constants/map';

const SearchPlace = ({ category }) => {
  const { isKakaoLoaded } = useMapInfo();
  const { myLocation, nearestSubwayStation } = useLocationInfo();
  const [nearbyPlaces, setNearbyPlaces] = useState([]); // 주변 장소
  const [isLoading, setIsLoading] = useState(false);
  // 선택 탭 ('place' | 'like')
  const { selectedTab } = usePlaceLikeToggleInfo();
  const isLikeList = selectedTab === 'like';

  const { userId } = useUserInfo();
  const { likedPlaces, routes } = usePromiseDataInfo();

  // Places 서비스 초기화
  const ps = useMemo(() => {
    if (!isKakaoLoaded) return null;
    return new window.kakao.maps.services.Places();
  }, [isKakaoLoaded]);

  // 검색 결과 처리
  const handleSearchResults = useCallback(
    (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 주변 장소 검색 결과
        const places = data.map((place) => ({
          placeId: place.id,
          type: category,
          name: place.place_name,
          phone: place.phone,
          address: place.road_address_name ?? place.address_name,
          link: place.place_url,
          position: new window.kakao.maps.LatLng(place.x, place.y),
          // 기본값
          isLiked: false,
          likesCount: 0,
        }));
        // 좋아요 내림차순 정렬
        const sortedPlaces = places.sort((p1, p2) => p2.likesCount - p1.likesCount);
        setNearbyPlaces(sortedPlaces);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setNearbyPlaces([]);
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        throw new Error('장소 검색 중 에러 발생');
      }
      setIsLoading(false);
    },
    [category],
  );

  // 장소 검색
  useEffect(() => {
    if (!ps) return;
    setIsLoading(true);
    setNearbyPlaces([]);

    // 주변 장소 검색
    const keyword = (nearestSubwayStation ?? DEFAULT_SUBWAY_STATION) + CATEGORY_LABEL[category];
    ps.keywordSearch(keyword, handleSearchResults);
  }, [category, ps, nearestSubwayStation, handleSearchResults]);

  // 주변 장소에 좋아요 정보 추가
  const mergedNearbyPlaces = useMemo(() => {
    if (isLoading) return []; // 검색 중이면

    return nearbyPlaces.map((place) => {
      const likedPlace = likedPlaces.find((p) => p.place.placeId === place.placeId);
      if (likedPlace) {
        const hasMyLike = likedPlace.userIds.includes(userId);
        return {
          ...place,
          isLiked: hasMyLike,
          likesCount: likedPlace.likesCount,
        };
      }
      return place;
    });
  }, [nearbyPlaces, likedPlaces, userId, isLoading]);

  // 좋아요 장소를 카카오 맵 형식으로 변환
  const mergedLikedPlaces = useMemo(() => {
    return likedPlaces.map((likedPlace) => ({
      placeId: likedPlace.place.placeId,
      type: likedPlace.place.type,
      name: likedPlace.place.name,
      address: likedPlace.place.address,
      position: new window.kakao.maps.LatLng(
        likedPlace.place.position.La,
        likedPlace.place.position.Ma,
      ),
      isLiked: likedPlace.userIds.includes(userId),
      likesCount: likedPlace.likesCount,
    }));
  }, [likedPlaces, userId]);

  // 마커용 장소 목록 (탭에 따라 다르게)
  const places = useMemo(() => {
    if (isLoading) return [];
    return isLikeList ? mergedLikedPlaces : mergedNearbyPlaces;
  }, [isLikeList, mergedLikedPlaces, mergedNearbyPlaces, isLoading]);

  return (
    <>
      <MarkerManager markers={[...places, ...(myLocation ? [myLocation] : [])]} routes={routes} />
      <BottomSheet id={MAP_BS_ID}>
        <S.ListContainer>
          <PlaceLikeToggle />
          <PlaceCardList
            places={places}
            isLoading={isLoading}
            emptyText={isLikeList ? '좋아요한 장소가 없어요' : '주변 장소가 없어요'}
          />
        </S.ListContainer>
      </BottomSheet>
      <S.NextBtnContainer>
        <S.Descriptrtion>원하는 장소를 선택해주세요</S.Descriptrtion>
        <button>약속 정보 보기</button>
      </S.NextBtnContainer>
    </>
  );
};

SearchPlace.propTypes = {
  category: PropTypes.oneOf(Object.values(CATEGORY)).isRequired,
};

export default SearchPlace;
