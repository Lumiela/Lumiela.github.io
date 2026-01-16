import styled from 'styled-components';

export const BoardContainer = styled.div`
  width: 100%;
`;

export const BoardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 0.9em;
`;

export const BoardTh = styled.th`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;

  &.board-author,
  &.board-date,
  &.board-views,
  &.board-status {
    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 10px 5px;
  }
`;

export const BoardTd = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;

  &.title {
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      text-decoration: underline;
    }
  }

  .private-icon {
    margin-left: 8px;
    color: #888;
  }

  &.status {
    font-weight: bold;
    color: #888;
    &.completed {
      color: #007bff;
    }
  }

  &.no-posts {
    text-align: center;
    padding: 50px;
    color: #888;
  }

  &.board-author,
  &.board-date,
  &.board-views,
  &.board-status {
    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 10px 5px;
  }
`;

export const BoardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
  }
`;

export const SearchInput = styled.input`
  border: none;
  padding: 8px 12px;
  font-size: 0.9em;
  outline: none;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SearchButton = styled.button`
  background-color: #f8f9fa;
  border: none;
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #ddd;

  &:hover {
    background-color: #f1f3f5;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

export const PaginationButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  color: #333;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    background-color: #f1f3f5;
  }

  &.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
