import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
  padding: 10px 10px 20px;
`;

export const EmptyText = styled.div`
  margin: 30px auto;
  color: ${theme.color.text.grey};
`;
