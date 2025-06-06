import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  width: 100%;
  height: ${({ $height }) => $height};

  label {
    margin-left: 4px;
    font-size: 14px;
    color: ${theme.color.text.grey};
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 60px;
  padding: 0 20px;
  border: 1px solid ${({ $hasError }) => ($hasError ? theme.color.error : theme.color.skyBlue)};
  border-radius: 15px;

  line-height: 24px;
  color: ${theme.color.black};

  &::placeholder {
    color: ${theme.color.text.grey};
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? theme.color.error : theme.color.main)};
    outline: none;
  }
`;

export const ErrorMessage = styled.p`
  margin: -5px 0 0 6px;
  font-size: 12px;
  color: ${theme.color.error};
`;
