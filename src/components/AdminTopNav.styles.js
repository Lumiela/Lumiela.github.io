import styled from 'styled-components';

export const AdminNavWrapper = styled.div`
  background-color: #3498db;
  color: white;
  padding: 10px 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  @media (max-width: 1023px) {
    padding: 8px 0;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1023px) {
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const Message = styled.p`
  margin: 0;
  font-weight: bold;
  color: white; /* p 태그의 color를 GlobalStyle에서 상속받지 않도록 명시적으로 지정 */

  @media (max-width: 1023px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 1023px) {
    gap: 5px;
  }
`;

export const ActionButton = styled.button`
  background: white;
  color: #3498db;
  border: 1px solid #3498db;
  border-radius: 4px;
  padding: 5px 15px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
  white-space: nowrap;

  &:hover {
    background-color: #f1f1f1;
  }

  &.dashboard-button {
    background: #fff;
    color: #3498db;
    border: 1px solid #fff;
  }

  &.dashboard-button:hover {
    background-color: #eee;
    color: #2980b9;
    border-color: #eee;
  }
  
  @media (max-width: 1023px) {
    padding: 6px 10px;
    font-size: 13px;
  }
`;
