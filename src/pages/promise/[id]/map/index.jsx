import * as S from './style';
import Header from '@/components/promise/Header';
import FinalPlaceMap from '@/components/promise/map/FinalPlaceMap';
// import { usePromiseDataFromServerInfo } from '@/hooks/stores/promise/usePromiseDataFromServerStore';

const MapPage = () => {
  // const { promiseDataFromServer } = usePromiseDataFromServerInfo();

  const dummyPlace = {
    placeId: '1313432',
    type: 'restuarant',
    name: '상도 곱창',
    position: {
      La: '127.02800140627488',
      Ma: '37.49808633653005',
    },
    address: '서울시 동작구 232',
    phone: '02-123-1234',
    link: 'https://blabla.com',
  };

  return (
    <S.Container>
      <Header text="약속 장소" />
      <S.MapWrapper>
        <FinalPlaceMap place={dummyPlace} />
      </S.MapWrapper>
    </S.Container>
  );
};

export default MapPage;
