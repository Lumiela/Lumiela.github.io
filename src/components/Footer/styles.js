import styled from 'styled-components';

export const FooterSection = styled.footer`
  scroll-snap-align: start;
  background-color: #222;
  padding: 2rem;
  font-size: 0.8rem;
  color: #aaa;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }

  @media (min-width: 1024px) {
    justify-content: center; /* 1024px 이상 해상도에서 내용 중앙 정렬 */
  }
`;

export const FooterInfo = styled.div`
  p {
    margin: 0.2rem 0;
  }
  
  @media (max-width: 768px) {
    p {
      margin-bottom: 0.5rem;
    }
  }
`;
