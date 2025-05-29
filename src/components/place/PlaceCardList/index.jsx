import * as S from './style';
import PropTypes from 'prop-types';
import PlaceCard from '../PlaceCard';
import PlaceCardSkeleton from '../PlaceCard/PlaceCardSkeleton';
import { CATEGORY } from '@/constants/place';

const PlaceCardList = ({ places, isLoading, emptyText, onCardClick }) => {
  if (isLoading) {
    return (
      <S.Container>
        {[...Array(4)].map((_, i) => (
          <PlaceCardSkeleton key={i} />
        ))}
      </S.Container>
    );
  }
  return (
    <S.Container>
      {places.length > 0 ? (
        places.map((place, i) => (
          <PlaceCard
            key={i}
            id={place.id}
            position={place.position}
            type={place.type}
            name={place.name}
            address={place.address}
            isLiked={place.isLiked}
            likesCount={place.likesCount}
            onClick={() => onCardClick(place)}
          />
        ))
      ) : (
        <S.EmptyText>{emptyText}</S.EmptyText>
      )}
    </S.Container>
  );
};

PlaceCardList.propTypes = {
  places: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      position: PropTypes.shape({
        La: PropTypes.string.isRequired,
        Ma: PropTypes.string.isRequired,
      }).isRequired,
      type: PropTypes.oneOf(Object.values(CATEGORY)),
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      isLiked: PropTypes.bool,
      likesCount: PropTypes.number,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  emptyText: PropTypes.string.isRequired,
  onCardClick: PropTypes.func,
};

export default PlaceCardList;
