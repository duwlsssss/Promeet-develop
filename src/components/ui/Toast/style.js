import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Toast = styled(motion.div)`
  position: fixed;
  z-index: 2;
  right: 16px;
  bottom: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px 24px;
  border-radius: 5px;

  color: #555555;
  text-align: center;
  white-space: nowrap;

  box-shadow: 0 2px 5px rgb(0, 0, 0, 20%);
`;
