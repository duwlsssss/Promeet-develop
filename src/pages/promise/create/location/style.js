import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FixedPlaceText = styled.p`
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: ${theme.color.text.blue};

  &:hover {
    text-decoration: underline;
  }
`;

export const Slide = styled(motion.div)`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background: ${theme.color.white};
`;
