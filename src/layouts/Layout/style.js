import styled from 'styled-components';

export const MainContainer = styled.main`
  position: relative;

  /* y축 스크롤만 허용 */
  overflow-x: hidden;

  /* 전체 높이 확보 */
  min-height: 100vh;

  /* Navibar에 안 가려지게 */
  padding-bottom: var(--nav-height);
`;
