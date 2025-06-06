import styled, { css } from 'styled-components';

export const CELL_SIZE = 40;
export const BORDER_SIZE = 2;

export const TableWrapper = styled.div`
  user-select: none;

  display: inline-block;

  border: none;
  border-radius: 8px;

  background: #ffffff;
  box-shadow: 0 2px 8px rgb(0, 0, 0, 4%);
`;

export const Row = styled.div`
  display: flex;
`;

export const Cell = styled.div`
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  border-right: ${BORDER_SIZE}px solid #f5f6f7;
  border-bottom: ${BORDER_SIZE}px solid #f5f6f7;

  font-size: 0.95rem;

  background: #ffffff;

  transition: background 0.15s;

  &:last-child {
    border-right: none;
  }
`;

export const Quarter = styled.div`
  cursor: pointer;
  flex: 1 1 0;
  width: 100%;
`;

export const HeaderCell = styled(Cell)`
  background: #ffffff;

  cursor: default;

  color: #6b7a99;
  font-family: Pretendard, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  ${({ $noTop }) =>
    $noTop &&
    css`
      border-top: none;
    `}
  ${({ $noLeft }) =>
    $noLeft &&
    css`
      border-left: none;
    `}
`;

export const AddButton = styled.button`
  cursor: pointer;

  width: 100%;
  margin-top: 16px;
  padding: 12px 0;
  border: none;
  border-radius: 6px;

  font-size: 1rem;
  font-weight: 600;
  color: #2563eb;

  background: #e6f0ff;

  transition: background 0.2s;

  &:hover,
  &:focus {
    color: #ffffff;
    background: #4f8cff;
    outline: none;
  }
`;
