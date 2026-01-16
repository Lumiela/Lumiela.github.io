import styled from 'styled-components';

export const BannerContainer = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

export const BannerContent = styled.div`
  position: relative;
  z-index: 1;
  color: #fff;
`;

export const BannerTitle = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;
