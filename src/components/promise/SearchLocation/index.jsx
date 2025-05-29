import * as S from './style';
import { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import PlaceCardList from '@/components/place/PlaceCardList';
import useMapStore from '@/stores/map/useMapStore';
import useMyLocationsStore from '@/stores/map/useMyLocationsStore';
import useLocationStore from '@/stores/promise/useLocationStore';
import { ROUTES } from '@/constants/routes';
import { PROMISE_LOCATION_HEADER_TEXT } from '@/constants/promise';
import { MY_LOC_MARKER_ID } from '@/constants/map';
import useDebounce from '@/hooks/useDebounce';
import useHandleError from '@/hooks/useHandleError';

const SearchLocation = ({ onBack }) => {
  const [searchInput, setSearchInput] = useState('');
  const searchTerm = useDebounce(searchInput, 300);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { setLocation } = useLocationStore(); // 최종 선택 위치

  const { isKakaoLoaded } = useMapStore();
  const { allowMyLocation, setMyLocation } = useMyLocationsStore();
  const handleError = useHandleError();

  const navigate = useNavigate();

  const handleMyLocationClick = () => {
    // 위치 동의 모달 띄우기
    if (!allowMyLocation) alert('위치 동의 필요');
    else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const latlng = new window.kakao.maps.LatLng(latitude, longitude);

            // 좌표 -> 주소
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const address = result[0].road_address
                  ? result[0].road_address.address_name
                  : result[0].address.address_name;
                setMyLocation({
                  position: { La: latitude, Ma: longitude },
                  id: MY_LOC_MARKER_ID,
                  address,
                });
                setLocation(address);
              }
            });
          },
          (error) => handleError(error),
        );
      }
    }
  };

  const handleCardClick = (place) => {
    // 장소 저장하고 장소 검색 슬라이드 닫기
    setLocation(place);
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
        id: place.id,
        name: place.place_name,
        address: place.road_address_name ?? place.address_name,
        position: new window.kakao.maps.LatLng(place.y, place.x),
      }));
      setPlaces(places);
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
      <input
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
    </S.Container>
  );
};

SearchLocation.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default SearchLocation;
