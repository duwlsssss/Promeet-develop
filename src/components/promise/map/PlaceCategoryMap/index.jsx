import * as S from './style';
import Tabs from '@/components/ui/Tabs';
import MapContainer from '../MapContainer';
import SearchPlace from '../SearchPlace';
import { useTabsInfo } from '@/hooks/stores/ui/useTabsStore';
import { useLocationInfo, useLocationActions } from '@/hooks/stores/promise/useLocationStore';
import useHandleError from '@/hooks/useHandleError';
import { CATEGORY, CATEGORY_LABEL } from '@/constants/place';
import { MY_LOC_MARKER_ID } from '@/constants/map';
import { useState } from 'react';
import LocationAgreementModal from '@/components/modal/LocationAgreementModal';

const PlaceCategoryMap = () => {
  const { selectedValue } = useTabsInfo();
  const { allowMyLocation } = useLocationInfo();
  const { setMyLocation } = useLocationActions();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // 임시 사용자 좌표
  const schoolLat = 37.494705526855;
  const schoolLng = 126.95994559383;

  const handleError = useHandleError();

  const handleMyLocationClick = () => {
    // 위치 동의 모달 띄우기
    if (!allowMyLocation) setIsLocationModalOpen(true);
    else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMyLocation({
              position: { La: latitude, Ma: longitude },
              id: MY_LOC_MARKER_ID, // 내 위치 마커 구분용
            });
          },
          (error) => handleError(error),
        );
      }
    }
  };

  return (
    <>
      <MapContainer lat={schoolLat} lng={schoolLng}>
        <SearchPlace category={selectedValue} />
      </MapContainer>
      <S.TabsWrapper>
        <Tabs defaultValue={CATEGORY.RESTAURANT} option="장소 카테고리 탭">
          <Tabs.List>
            {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
              <Tabs.Trigger key={value} value={value} label={label} />
            ))}
          </Tabs.List>
        </Tabs>
      </S.TabsWrapper>
      <S.MyLocationIcon onClick={handleMyLocationClick} />
      {/* 위치 동의 모달 */}
      <LocationAgreementModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  );
};

export default PlaceCategoryMap;
