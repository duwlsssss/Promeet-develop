import * as S from './style';
import { useState } from 'react';
import FinalPlaceMap from '@/components/promise/map/FinalPlaceMap';

const SummaryPage = () => {
  const [isOpenMap, setIsOpenMap] = useState(false);
  const placeData = {
    address: '서울 동작구 상도로37길 80',
    id: '2017883339',
    link: 'http://place.map.kakao.com/2017883339',
    name: '상도국수',
    phone: '02-886-7089',
    position: { La: 37.49735872568539, Ma: 126.9533182498855 },
    type: 'restaurant',
  };

  const handlePlaceMapClick = () => {
    setIsOpenMap(!isOpenMap);
  };

  return (
    <S.Container>
      <button onClick={handlePlaceMapClick}>{isOpenMap ? '닫기' : '약속 장소 확인'}</button>
      {isOpenMap ? <FinalPlaceMap place={placeData} /> : null}
    </S.Container>
  );
};

export default SummaryPage;
