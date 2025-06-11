import * as S from './style';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import PlaceCardList from '@/components/promise/place/PlaceCardList';
import PlaceLikeToggle from '@/components/promise/place/PlaceLikeToggle';
import MarkerManager from '../MarkerManager';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import useFinalizePromise from '@/hooks/mutations/useFinalizePromise';
import { useMapInfo } from '@/hooks/stores/promise/map/useMapStore';
import { useUserInfo } from '@/hooks/stores/auth/useUserStore';
import { useLocationInfo } from '@/hooks/stores/promise/useLocationStore';
import { usePromiseDataInfo } from '@/hooks/stores/promise/usePromiseDataStore';
import { usePromiseDataFromServerInfo } from '@/hooks/stores/promise/usePromiseDataFromServerStore';
import { usePlaceLikeToggleInfo } from '@/hooks/stores/promise/usePlaceLikeToggleStore';
import { CATEGORY, CATEGORY_LABEL } from '@/constants/place';
import { DEFAULT_SUBWAY_STATION } from '@/constants/promise';
import { ROUTES } from '@/constants/routes';
import { MAP_BS_ID } from '@/constants/map';

const getDescText = (userType, canFix, isFinalizePending) => {
  const descTexts = {
    create: {
      true: isFinalizePending ? '약속 장소를 선택해주세요' : '약속 확정 중',
      false: '모든 사용자가 좋아요를 입력해야해요',
    },
    join: {
      true: '하나 이상의 장소를 좋아요하세요',
      false: '하나 이상의 장소를 좋아요하세요',
    },
  };
  return descTexts[userType][canFix];
};

const getBtnText = (userType) => {
  const btnTexts = {
    create: {
      true: '이 장소를 선택',
    },
    join: {
      true: '약속 정보 보기',
    },
  };
  return btnTexts[userType];
};

const SearchPlace = ({ category }) => {
  const { isKakaoLoaded } = useMapInfo();
  const { myLocation } = useLocationInfo();
  const [nearbyPlaces, setNearbyPlaces] = useState([]); // 주변 장소
  const [isLoading, setIsLoading] = useState(false);
  // 선택 탭 ('place' | 'like')
  const { selectedTab } = usePlaceLikeToggleInfo();
  const isLikeList = selectedTab === 'like';

  const { userId, userType } = useUserInfo();
  const { selectedPlace } = usePromiseDataInfo();
  const { promiseDataFromServer } = usePromiseDataFromServerInfo();
  const { likedPlaces, routes, centerStation, canFix } = promiseDataFromServer;
  const { mutate: finalizePromise, isPending: isFinalizePending } = useFinalizePromise();

  const navigate = useNavigate();
  const { promiseId } = useParams();

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
          position: new window.kakao.maps.LatLng(place.y, place.x),
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
    const keyword = (centerStation.name ?? DEFAULT_SUBWAY_STATION) + CATEGORY_LABEL[category];
    ps.keywordSearch(keyword, handleSearchResults);
  }, [category, ps, centerStation, handleSearchResults]);

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

  const descText = getDescText(userType, canFix, isFinalizePending);
  const btnText = getBtnText(userType);

  const handleNextBtnClick = () => {
    finalizePromise({ promiseId, selectedPlace });
    navigate(ROUTES.PROMISE_SUMMARY);
  };

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
        <S.Descriptrtion>{descText}</S.Descriptrtion>
        <Button onClick={handleNextBtnClick} disabled={!canFix}>
          {btnText}
        </Button>
      </S.NextBtnContainer>
    </>
  );
};

SearchPlace.propTypes = {
  category: PropTypes.oneOf(Object.values(CATEGORY)).isRequired,
};

export default SearchPlace;
