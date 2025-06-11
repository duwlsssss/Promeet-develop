import * as S from './style';
import { useState } from 'react';
import Tabs from '@/components/ui/Tabs';
import MapContainer from '../MapContainer';
import SearchPlace from '../SearchPlace';
import { useTabsInfo } from '@/hooks/stores/ui/useTabsStore';
import { useLocationInfo, useLocationActions } from '@/hooks/stores/promise/useLocationStore';
import { usePromiseDataFromServerInfo } from '@/hooks/stores/promise/usePromiseDataFromServerStore';
import useHandleError from '@/hooks/useHandleError';
import { CATEGORY, CATEGORY_LABEL } from '@/constants/place';
import { MY_LOC_MARKER_ID, DEFAULT_LAT, DEFAULT_LNG } from '@/constants/map';
import LocationAgreementModal from '@/components/modal/LocationAgreementModal';

const PlaceCategoryMap = () => {
  const { selectedValue } = useTabsInfo();
  const { allowMyLocation, myLocation } = useLocationInfo();
  const { setMyLocation } = useLocationActions();
  const { promiseDataFromServer } = usePromiseDataFromServerInfo();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

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
              position: { Ma: latitude, La: longitude },
              id: MY_LOC_MARKER_ID, // 내 위치 마커 구분용
            });
          },
          (error) => handleError(error),
        );
      }
    }
  };

  const mapLat = myLocation?.position.Ma ?? DEFAULT_LAT;
  const mapLng = myLocation?.position.La ?? DEFAULT_LNG;

  return (
    <>
      <MapContainer lat={mapLat} lng={mapLng}>
        <SearchPlace category={selectedValue} canFix={promiseDataFromServer.canFix} />
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
