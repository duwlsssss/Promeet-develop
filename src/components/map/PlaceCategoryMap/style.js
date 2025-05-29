import styled from 'styled-components';
import { theme } from '@/styles/theme';
import MyLocationSvg from '@/assets/img/icon/map/my_location.svg?react';

export const TabsWrapper = styled.div`
  position: absolute;
  z-index: 2;
  top: 16px;
  left: 16px;
`;

export const List = styled.div`
  overflow-y: scroll;
  width: 100%;
  height: 200px;
  background-color: ${theme.color.white};
`;

export const MyLocationIcon = styled(MyLocationSvg)`
  position: absolute;
  z-index: 2;
  bottom: 35px;
  left: 35px;

  width: 40px;
  height: 40px;
`;
