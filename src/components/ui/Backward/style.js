import styled from 'styled-components';
import BackSVG from '@/assets/img/icon/back.svg?react';

export const BackIcon = styled(BackSVG)`
  cursor: pointer;
  flex-shrink: 0;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
`;
