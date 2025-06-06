import styled from 'styled-components';
import { theme } from '@/styles/theme';
import LogoSvg from '@/assets/img/logo.svg?react';

// 로그인 전
export const EnterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 400px;
  align-items: center;
  justify-content: center;

  /* 전체 화면 채우기 트릭 */
  width: 100vw;
  margin-left: calc(0px - var(--outlet-padding));
  padding: 0 var(--outlet-padding);

  background-color: #c6ebe5;
`;

export const LogoContainer = styled.header`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

export const Logo = styled(LogoSvg)`
  flex-shrink: 0;
`;

export const EnterText = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.color.point1};
`;

// 로그인 후
export const Container = styled.section`
  display: flex;
  flex-direction: column;

  /* nav에 내용 가려지지 않게 아래 padding 줌 */
  padding-bottom: var(--nav-height);
`;

export const Header = styled.h1`
  font-size: 24px;
  font-weight: 700;
  white-space: pre-line;
`;
