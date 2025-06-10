import * as S from './style';
import { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Input from '@/components/ui/Input';
import PlaceCardList from '@/components/promise/place/PlaceCardList';
import { useMapInfo } from '@/hooks/stores/promise/map/useMapStore';
import { useLocationInfo, useLocationActions } from '@/hooks/stores/promise/useLocationStore';
import { ROUTES } from '@/constants/routes';
import { PROMISE_LOCATION_HEADER_TEXT } from '@/constants/promise';
import { MY_LOC_MARKER_ID } from '@/constants/map';
import useDebounce from '@/hooks/useDebounce';
import useHandleError from '@/hooks/useHandleError';
import useNearestSubwayStation from '@/hooks/kakao/useNearestSubwayStation';
import LocationAgreementModal from '@/components/modal/LocationAgreementModal';

const SearchLocation = ({ onBack }) => {
  const [searchInput, setSearchInput] = useState('');
  const searchTerm = useDebounce(searchInput, 300);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const { isKakaoLoaded } = useMapInfo();
  const { allowMyLocation } = useLocationInfo();
  const { setMyLocation } = useLocationActions();
  const handleError = useHandleError();
  const navigate = useNavigate();

  // 선택한 위치의 가까운 역 찾기
  useNearestSubwayStation(selectedPosition?.Ma, selectedPosition?.La);

  const handleMyLocationClick = () => {
    if (!allowMyLocation) {
      setIsLocationModalOpen(true); // 위치 동의 모달 오픈
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // 내 위치 저장 - 마커에서 사용
            setMyLocation({
              position: { Ma: latitude, La: longitude },
              placeId: MY_LOC_MARKER_ID,
            });
          },
          (error) => handleError(error),
        );
      }
    }
  };

  const handleCardClick = (place) => {
    // 주소 저장해 중간 위치 저장 후 장소 검색 슬라이드 닫기
    setSelectedPosition(place.position);
    onBack();
    navigate(ROUTES.PROMISE_CREATE_SCHEDULE);
  };

  // Places 서비스 초기화
  const ps = useMemo(() => {
    if (!isKakaoLoaded) return null;
    return new window.kakao.maps.services.Places();
  }, [isKakaoLoaded]);

  // 검색 콜백
  const placesSearchCB = useCallback((data, status) => {
    setIsLoading(false); // 검색 완료되면 로딩 종료
    if (status === window.kakao.maps.services.Status.OK) {
      const places = data.map((place) => ({
        // 위치 정보 저장
        placeId: place.id,
        name: place.place_name,
        address: place.road_address_name ?? place.address_name,
        position: new window.kakao.maps.LatLng(place.y, place.x),
      }));
      setPlaces(places);
      // console.log('places', places);
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      setPlaces([]);
    } else if (status === window.kakao.maps.services.Status.ERROR) {
      throw new Error('장소 검색 중 에러 발생');
    }
  }, []);

  const hasSearchTerm = !!searchTerm.trim();
  // 장소 검색 함수
  const searchPlaces = useCallback(() => {
    if (!ps || !hasSearchTerm) return;
    setIsLoading(true); // 검색 시작시 로딩 시작
    ps.keywordSearch(searchTerm, placesSearchCB);
  }, [ps, placesSearchCB, searchTerm, hasSearchTerm]);

  useEffect(() => {
    if (!ps || !hasSearchTerm) return;
    searchPlaces();
  }, [ps, searchPlaces, searchTerm, hasSearchTerm]);

  const emptyText = hasSearchTerm ? '찾으시는 장소가 없어요' : '주소를 입력해주세요';

  return (
    <S.Container>
      <Header
        text={PROMISE_LOCATION_HEADER_TEXT}
        backwardSize="22px"
        backwardType="arrow"
        onBackwardClick={onBack}
      />
      <Input
        height="60px"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="주소를 입력해주세요"
      />
      {hasSearchTerm ? (
        <PlaceCardList
          places={places}
          isLoading={isLoading}
          emptyText={emptyText}
          onCardClick={handleCardClick}
        />
      ) : (
        <S.CurrLocationButton>
          <S.LocationIcon />
          <span onClick={handleMyLocationClick}>현위치 불러오기</span>
        </S.CurrLocationButton>
      )}
      {/* 위치 동의 모달 */}
      <LocationAgreementModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </S.Container>
  );
};

SearchLocation.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default SearchLocation;
