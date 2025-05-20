// import * as S from './style';
// import PropTypes from 'prop-types';
// import useMapStore from '@/stores/map/mapStore';

// // 지도 표시하는 컴포넌트
// const MapContainer = ({ children }) => {
//   const $mapEl = document.querySelector('#map');
//   const setMap = useMapStore((state) => state.setMap);
//   const Kakao = window.kakao;

//   if ($mapEl) return;

//   const options = {
//     center: new Kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표
//     level: 3, //지도의 레벨(확대, 축소 정도)
//   };
//   const mapInstance = new Kakao.maps.Map($mapEl, options); //지도 생성 및 객체 리턴

//   setMap(mapInstance);
//   console.log('지도 등장');

//   return <S.MapDiv id="map">{children}</S.MapDiv>;
// };

// MapContainer.propTypes = {
//   children: PropTypes.node,
// };

// export default MapContainer;

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as S from './style';
import useMapStore from '@/stores/map/mapStore';

const MapContainer = ({ children }) => {
  const mapRef = useRef(null);
  const setMap = useMapStore((state) => state.setMap);

  useEffect(() => {
    const loadKakaoMapScript = () => {
      return new Promise((resolve, reject) => {
        // 이미 kakao 객체가 로드된 경우
        if (window.kakao && window.kakao.maps) {
          resolve(window.kakao);
          return;
        }

        // Kakao Maps SDK가 아직 로드되지 않았다면
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false&libraries=services,clusterer,drawing`;
        script.async = true;
        script.onload = () => resolve(window.kakao);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadKakaoMapScript()
      .then((kakao) => {
        kakao.maps.load(() => {
          if (!mapRef.current) return;

          const options = {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
          };

          const map = new kakao.maps.Map(mapRef.current, options);
          setMap(map);
        });
      })
      .catch((_err) => {
        throw new Error(`[카카오 맵 로드 에러]`);
      });
  }, [setMap]);

  return (
    <S.MapDiv id="map" ref={mapRef}>
      {children}
    </S.MapDiv>
  );
};

MapContainer.propTypes = {
  children: PropTypes.node,
};

export default MapContainer;
