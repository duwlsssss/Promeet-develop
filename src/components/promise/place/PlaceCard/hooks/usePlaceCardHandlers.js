import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMapInfo } from '@/hooks/stores/promise/map/useMapStore';
import { useBottomSheetActions } from '@/hooks/stores/ui/useBottomSheetStore';
import { useMarkerActions } from '@/hooks/stores/promise/map/useMarkerStore';
import { useUserInfo } from '@/hooks/stores/auth/useUserStore';
import {
  usePromiseDataInfo,
  usePromiseDataActions,
} from '@/hooks/stores/promise/usePromiseDataStore';
import useToggleLikePlace from '@/hooks/mutations/useToggleLikePlace';
import { ROUTES } from '@/constants/routes';

export default function usePlaceCardHandlers(place, $isRetrieved) {
  const { map } = useMapInfo();
  const { setActiveBottomSheet } = useBottomSheetActions();
  const { setActiveMarkerId } = useMarkerActions();
  const { userId, userType } = useUserInfo();
  const { likedPlaces, fixedPlace } = usePromiseDataInfo();
  const { setFixedPlace } = usePromiseDataActions();
  const { promiseId } = useParams();
  const { pathname } = useLocation();
  const { mutate: toggleLike } = useToggleLikePlace();
  const [isRetrieved, setIsRetrieved] = useState(false); // 조회될때 색 표시

  useEffect(() => {
    if ($isRetrieved) {
      setIsRetrieved(true);
      setTimeout(() => setIsRetrieved(false), 1500);
    }
  }, [$isRetrieved]);

  const likedPlace = likedPlaces?.find((p) => p.place.placeId === place.placeId);
  const isLiked = likedPlace?.userIds?.includes(userId) ?? false;
  const likesCount = likedPlace?.likesCount ?? 0;

  const handleCardClick = () => {
    setActiveBottomSheet(null);
    map.panTo(new window.kakao.maps.LatLng(place.position.La, place.position.Ma));
    setActiveMarkerId(place.placeId);
  };

  const handleLikeToggle = () => {
    if (!promiseId) return;
    toggleLike({ place, promiseId, isLiked });
  };

  const handleClickFixPlaceBtn = () => {
    isSelected ? setFixedPlace(null) : setFixedPlace(place);
  };

  const isCreator = userType === 'create';

  const isSelected = fixedPlace?.placeId === place.placeId;

  // 위치 입력 컴포넌트에선 하트 안 보여주기
  const showHeart = pathname === ROUTES.PROMISE_CREATE_LOCATION || ROUTES.PROMISE_LOCATION;

  return {
    handleCardClick,
    handleLikeToggle,
    handleClickFixPlaceBtn,
    isCreator,
    isLiked,
    likesCount,
    isSelected,
    isRetrieved,
    showHeart,
  };
}
