import styled from 'styled-components';

export const SupportTabsContainer = styled.div`
  display: flex;
  justify-content: left;
  border-bottom: 2px solid #eee;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    overflow-x: auto;
    white-space: nowrap;
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const SupportTab = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: #888;
  position: relative;
  transition: color 0.3s;
  flex-shrink: 0;

  &.active {
    color: #333;
    font-weight: 700;
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #333;
    }
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 1rem;
  }
`;

export const SupportContentContainer = styled.div`
  padding: 1rem 0;
`;

export const SupportContentSection = styled.div`
  width: 100%;
  padding: 1rem;
`;
