import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: ${theme.color.point1};
`;

export const TableScrollWrapper = styled.div`
  overflow: auto;
  width: 100%;
  max-width: 400px;
  max-height: 600px;
`;

export const TableInnerWrapper = styled.div`
  width: fit-content;
`;

export const CreatePromiseButton = styled.button`
  width: 400px;
  height: 48px;
  margin-top: 24px;
  border: none;
  border-radius: 8px;

  color: ${theme.color.white};

  background: ${theme.color.main};
`;
