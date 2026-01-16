import styled from 'styled-components';
import { Swiper } from 'swiper/react'; // For the modal swiper

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

export const CaseExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
  justify-content: center;
  padding: 20px 0;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

export const CaseCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: left;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

export const CaseCardThumbnail = styled.div`
  width: 100%;
  padding-top: 75%;
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    filter: none !important;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: auto;
    transform: translateZ(0);
  }

  ${CaseCard}:hover & img {
    transform: scale(1.05);
  }
`;

export const CaseCardTitle = styled.div`
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-top: auto;
  -webkit-font-smoothing: antialiased;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const ModalSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: #007bff;
  }

  .swiper-pagination-bullet-active {
    background: #007bff;
  }
`;
