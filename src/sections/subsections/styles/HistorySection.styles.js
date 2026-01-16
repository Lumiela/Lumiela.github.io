import styled from 'styled-components';

export const HistoryContainer = styled.div`
  padding: clamp(60px, 8vw, 120px) 0;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  overflow: hidden; /* 슬라이드 영역 밖 숨김 */
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: clamp(40px, 6vw, 80px);
  padding: 0 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  white-space: nowrap; /* 한 줄 고정 */
  flex-shrink: 0; 

  .page-num {
    font-size: 16px;
    font-weight: 500;
    color: #888;
    min-width: 60px;
  }

  .nav-buttons {
    display: flex;
    gap: 12px;
  }

  button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid #eee;
    background: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
    
    &:disabled {
      opacity: 0.3;
      cursor: default;
    }

    &:hover:not(:disabled) {
      border-color: #2e9d41;
      color: #2e9d41;
      background: #f9f9f9;
    }
  }
`;

export const TimelineWrapper = styled.div`
  position: relative;
  padding: 60px 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 5px; 
    left: 0;
    right: 0;
    height: 1px;
    background-color: #eee;
    z-index: 0;
  }
`;

export const TimelineTrack = styled.div`
  display: flex;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
`;

export const TimelineItem = styled.div`
  flex: 0 0 100%; 
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;

  /* 모든 아이템의 Dot과 연도 컬러를 초록색으로 통일 */
  .dot { 
    background-color: #2e9d41; 
    border: 3px solid #fff;
    box-shadow: 0 0 0 1px #2e9d41; /* 점의 테두리를 더 선명하게 */
  }
  .year { 
    color: #2e9d41; 
  }
`;

export const TimelineDot = styled.div`
  position: absolute;
  top: -58px;
  left: 20px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  z-index: 1;
`;

export const YearTitle = styled.h3`
  font-size: clamp(60px, 15vw, 120px);
  font-weight: 900;
  margin: 0 0 30px 0;
  letter-spacing: -4px;
  line-height: 0.9;
`;

export const EventList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 800px;

  li {
    font-size: clamp(15px, 1.8vw, 18px);
    color: #444;
    margin-bottom: 18px;
    display: flex;
    align-items: flex-start;
    line-height: 1.6;

    &::before {
      content: '○';
      margin-right: 15px;
      font-size: 0.9em;
      color: #bbb;
      margin-top: 4px;
    }

    .month {
      font-weight: 800;
      color: #222;
      margin-right: 12px;
      min-width: 30px;
    }

    .content {
      flex: 1;
      word-break: keep-all;
    }
  }
`;