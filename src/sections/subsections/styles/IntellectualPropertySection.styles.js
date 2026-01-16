import styled from 'styled-components';
import { Swiper } from 'swiper/react';

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

export const IPSectionContainer = styled.div`
  padding: 60px 15px;
  text-align: center;
`;

export const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 400px; 
  padding: 40px 0 60px 0; 

  .swiper-slide {
    transition: all 0.5s ease-in-out;
    transform: scale(0.8);
    opacity: 0.4;
    filter: blur(4px);
    height: 250px;
  }

  .swiper-slide-active {
    transform: scale(1.3);
    opacity: 1;
    filter: blur(0);
    z-index: 10;
  }

  @media (min-width: 768px) {
    height: 500px;
    .swiper-slide {
      height: 350px;
    }
    .swiper-slide-active {
      transform: scale(1.4);
    }
  }

  @media (min-width: 1024px) {
    height: 600px; 
    padding: 20px 0 50px 0;
    .swiper-slide {
      height: 380px; 
    }
    .swiper-slide-active {
      transform: scale(1.5); 
    }
  }
`;

export const GalleryItem = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
`;

export const GalleryThumbnail = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const GalleryTitle = styled.div`
  padding: 10px;
  font-size: 0.9rem;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
`;
