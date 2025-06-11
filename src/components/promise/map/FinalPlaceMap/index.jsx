import PropTypes from 'prop-types';
import MapContainer from '../MapContainer';
import MarkerManager from '../MarkerManager';
import { CATEGORY } from '@/constants/place';

// 최종 약속 위치 표시하는 맵
const FinalPlaceMap = ({ place }) => {
  console.log('place in FPM', place);
  return (
    <MapContainer lat={place.position.Ma} lng={place.position.La}>
      <MarkerManager markers={[place]} />
    </MapContainer>
  );
};

FinalPlaceMap.propTypes = {
  place: PropTypes.shape({
    position: PropTypes.shape({
      Ma: PropTypes.number.isRequired,
      La: PropTypes.number.isRequired,
    }).isRequired,
    id: PropTypes.string,
    type: PropTypes.oneOf(Object.values(CATEGORY)),
    name: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
};

export default FinalPlaceMap;
