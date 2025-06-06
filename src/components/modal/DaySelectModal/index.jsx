import PropTypes from 'prop-types';
import * as S from './style';

const DAYS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

const DaySelectModal = ({ isOpen, onClose, onSelect }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={handleOverlayClick}>
      <S.Modal>
        <S.List>
          {DAYS.map((day) => (
            <S.Item key={day}>
              <S.Button
                type="button"
                onClick={() => {
                  onSelect(day);
                  onClose();
                }}
              >
                {day}
              </S.Button>
            </S.Item>
          ))}
        </S.List>
      </S.Modal>
    </S.Overlay>
  );
};

DaySelectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DaySelectModal;
