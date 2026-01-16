import styled from 'styled-components';

export const SubsectionTitleContainer = styled.div`
  text-align: center;
  margin: 50px 0;
  @media (max-width: 768px) {
    margin: 30px 0;
  }
`;

export const SubsectionTitle = styled.p`
  font-size: 48px;
  font-weight: 800;
  color: #ff5e1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0;

  .quote {
    color: #555;
    font-family: serif;
  }

  @media (max-width: 768px) {
    font-size: 30px;
    gap: 5px;
  }
`;

export const DirectionsInfo = styled.div`
  p {
    font-size: 1.1rem;
    line-height: 1.8;
  }

  strong {
    color: #333;
  }

  a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    flex: 1;
  }
`;

export const MapWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 450px;
    border: 0;
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    iframe {
      height: 300px;
    }
  }
`;

export const CompanyImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 0 auto;

  @media (min-width: 769px) and (max-width: 1024px) {
    flex: 1;
    max-width: 50%;
    align-self: center;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const DirectionsContent = styled.div`
  @media (min-width: 769px) and (max-width: 1024px) {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
