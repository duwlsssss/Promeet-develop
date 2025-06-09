import { useState } from 'react';
import PropTypes from 'prop-types';
import CommonModal from '@/components/modal/CommonModal';
import * as S from './style';
import { useLocationActions } from '@/hooks/stores/promise/useLocationStore';

const MY_LOC_MARKER_ID = 'MY_LOCATION_MARKER';

const LocationAgreementModal = ({ isOpen, onClose }) => {
  const { setAllowMyLocation, setMyLocation } = useLocationActions();
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleError = (_err) => {
    setError('위치 정보를 가져올 수 없습니다.');
    setAllowMyLocation(false);
  };

  const handleAgree = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const latlng = new window.kakao.maps.LatLng(latitude, longitude);
          // 내 위치 저장 - 마커에서 사용
          setMyLocation({
            position: { La: latitude, Ma: longitude },
            placeId: MY_LOC_MARKER_ID,
          });

          // 좌표 -> 주소
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const address = result[0].road_address
                ? result[0].road_address.address_name
                : result[0].address.address_name;
              setLocation(address); // 주소 문자열 저장
            }
          });
          setAllowMyLocation(true);
          onClose();
        },
        (error) => handleError(error),
      );
    } else {
      setError('이 브라우저에서는 위치 정보가 지원되지 않습니다.');
      setAllowMyLocation(false);
    }
  };

  const handleDisagree = () => {
    setAllowMyLocation(false);
    onClose();
  };

  return (
    <CommonModal isOpen={isOpen} onClose={onClose}>
      <S.Title>위치 정보 수집 동의</S.Title>
      <S.Description>서비스 이용을 위해 위치 정보 수집에 동의해 주세요.</S.Description>
      {error && <S.Error>{error}</S.Error>}
      <S.ButtonWrapper>
        <S.AgreeButton onClick={handleAgree}>동의</S.AgreeButton>
        <S.DisagreeButton onClick={handleDisagree}>거부</S.DisagreeButton>
      </S.ButtonWrapper>
      {location && <S.LocationInfo>내 위치: {location}</S.LocationInfo>}
    </CommonModal>
  );
};

LocationAgreementModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LocationAgreementModal;
