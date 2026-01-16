import styled from 'styled-components';
import { Swiper } from 'swiper/react';

export const IPContainer = styled.div`
  padding: clamp(60px, 8vw, 120px) 0;
  position: relative;
  overflow: hidden;
  text-align: center;
`;

export const SectionHeader = styled.div`
  margin-bottom: clamp(40px, 6vw, 80px);
  text-align: center;

  .main-title {
    margin-top: 10px;
    font-size: 18px;
    color: #666;
  }
`;

export const StyledSwiper = styled(Swiper)`
  width: 100%;
  padding: 50px 0 80px 0; 

  .swiper-slide {
    transition: all 0.4s ease;
    transform: scale(0.85); /* 주변 이미지 크기 상향 */
    opacity: 0.6; /* 투명도 완화 */
    filter: blur(1.5px); /* 블러 최소화 */
    display: flex;
    justify-content: center;
  }

  .swiper-slide-active {
    transform: scale(1.1); /* 중앙 강조 수치 현실화 */
    opacity: 1;
    filter: blur(0);
    z-index: 10;
  }

  /* 네비게이션 버튼 가독성 */
  .swiper-button-next, .swiper-button-prev {
    color: #ff5e1a;
    transform: scale(0.7);
  }

  .swiper-pagination-bullet-active {
    background: #ff5e1a;
  }
`;

export const GalleryItem = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 380px;
  height: 480px; 
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eee;
`;

export const GalleryThumbnail = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; /* 인증서 비율 유지 */
  }
`;

export const GalleryTitle = styled.div`
  padding: 18px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
  background-color: #fafafa;
  border-top: 1px solid #f0f0f0;
`;