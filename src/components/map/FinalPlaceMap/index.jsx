import PropTypes from 'prop-types';
import MapContainer from '../MapContainer';
import MarkerManager from '../MarkerManager';
import { CATEGORY } from '@/constants/place';

const FinalPlaceMap = ({ place }) => {
  return (
    <MapContainer lat={place.position.Ma} lng={place.position.La}>
      <MarkerManager markers={[place]} />
    </MapContainer>
  );
};

FinalPlaceMap.propTypes = {
  place: PropTypes.shape({
    position: PropTypes.shape({
      La: PropTypes.number.isRequired,
      Ma: PropTypes.number.isRequired,
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
