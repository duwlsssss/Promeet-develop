import * as S from './style';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Backward 컴포넌트
 *
 * @property {string} [size='24px'] - 사이즈
 * @property {boolen} [isErrorFallback=false] - 에러 컴포넌트 여부
 * @property {string} [navigateUrl=''] - 클릭시 이동할 경로
 */

const Backward = ({ size = '24px', isErrorFallback = false, navigateUrl = '' }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    // 에러 컴포넌트에서는 window.history로 전으로 이동
    if (isErrorFallback) {
      window.history.back();
      return;
    }
    // 이동 경로 받았으면
    if (navigateUrl) {
      navigate(navigateUrl);
    } else {
      // 아니면 전으로 이동
      navigate(-1);
    }
  };

  return <S.BackIcon $size={size} onClick={handleBackClick} />;
};

Backward.propTypes = {
  size: PropTypes.string,
  isErrorFallback: PropTypes.bool,
  navigateUrl: PropTypes.string,
};

export default Backward;
