import * as S from './style';
import Tabs from '@/components/ui/Tabs';
import MapContainer from '@/components/map/MapContainer';
import SearchPlace from '@/components/map/SearchPlace';
import useTabsStore from '@/stores/ui/useTabsStore';
import useMyLocationsStore from '@/stores/map/useMyLocationsStore';
import useHandleError from '@/hooks/useHandleError';
import { CATEGORY, CATEGORY_LABEL } from '@/constants/place';
import { MY_LOC_MARKER_ID } from '@/constants/map';

const PlaceCategoryMap = () => {
  const { selectedValue } = useTabsStore();
  const { allowMyLocation, setMyLocation } = useMyLocationsStore();

  // 임시 사용자 좌표
  const schoolLat = 37.494705526855;
  const schoolLng = 126.95994559383;

  const handleError = useHandleError();

  const handleMyLocationClick = () => {
    // 위치 동의 모달 띄우기
    if (!allowMyLocation) alert('위치 동의 필요');
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
    </>
  );
};

export default PlaceCategoryMap;
