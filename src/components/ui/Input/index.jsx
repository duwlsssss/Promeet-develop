import * as S from './style';
import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';

const FormInput = ({ label, id, name, height, control, ...props }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    ...props,
  });

  return (
    <S.InputWrapper $height={height}>
      {label && <label htmlFor={id}>{label}</label>}
      <S.Input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        $hasError={error}
        autoComplete="off"
        spellCheck="false"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error?.message && (
        <S.ErrorMessage id={`${id}-error`} role="alert" aria-live="polite">
          {error.message}
        </S.ErrorMessage>
      )}
    </S.InputWrapper>
  );
};

const BasicInput = ({ label, id, height, error, isTouched, ...props }) => {
  return (
    <S.InputWrapper $height={height}>
      {label && <label htmlFor={id}>{label}</label>}
      <S.Input
        id={id}
        name={name}
        $hasError={isTouched && error}
        autoComplete="off"
        spellCheck="false"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {isTouched && error && (
        <S.ErrorMessage id={`${id}-error`} role="alert" aria-live="polite">
          {error}
        </S.ErrorMessage>
      )}
    </S.InputWrapper>
  );
};

/**
 * Input 컴포넌트
 * @param {string} [label] - input 설명 라벨 (선택)
 * @param {string} [id] - input id (label이 있을 때만 필수)
 * @param {boolean} [useForm=false] - react-hook-form 사용 여부
 * @param {string} [height='100px'] - lable, input, errorMessage 포함 높이 지정
 * @param {string} [error] - 에러 메시지 (useForm=false일 때)
 * @param {boolean} [isTouched] - 입력 필드 터치 여부 (useForm=false일 때)
 */
const Input = ({ useForm = false, height = '100px', error, isTouched, ...props }) => {
  if (useForm) {
    return <FormInput height={height} {...props} />;
  }

  return <BasicInput error={error} isTouched={isTouched} {...props} />;
};

FormInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  height: PropTypes.string,
  control: PropTypes.object.isRequired,
};

BasicInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  height: PropTypes.string,
  error: PropTypes.string.isRequired,
  isTouched: PropTypes.bool,
};

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  useForm: PropTypes.bool,
  height: PropTypes.string,
  error: PropTypes.string,
  isTouched: PropTypes.bool,
};

export default Input;
