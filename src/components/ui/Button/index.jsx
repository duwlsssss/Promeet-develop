import * as S from './style';
import PropTypes from 'prop-types';

/**
 * Button 컴포넌트
 *
 * @property {string} text - 버튼 글자
 */

const Button = ({ text }) => {
  return <S.Button>{text}</S.Button>;
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Button;
