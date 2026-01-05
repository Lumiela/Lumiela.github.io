import React, { forwardRef } from 'react';
import './HomeSection.css';

import sliderImage from '../assets/images/slider-01.jpg';
import aboutImage from '../assets/images/about.png';
import field01Image from '../assets/images/field-01.jpg';
import field02Image from '../assets/images/field-02.jpg';
import field03Image from '../assets/images/field-03.jpg';
import field04Image from '../assets/images/field-04.jpg';

const HomeSection = forwardRef((props, ref) => {
  return (
    <section id="home" className="section" ref={ref}>
      <div className="home-container">
        {/* 메인 슬라이더/베너 영역: 이미지가 위, 텍스트가 아래로 배치 */}
        <div className="main-banner">
          <div className="banner-image-container">
            <img 
              src={sliderImage} 
              alt="홈 화면 이미지" 
              className="full-width-img" 
            />
          </div>
          <div className='banner-text'>
            <p className="sub-title">더 나은 농업의 미래를 위한</p>
            <h2 className="main-title">다온알에스의</h2>
            <h2 className="main-title">끊임없는 도전</h2>
          </div>
        </div>

        {/* 소개 영역 */}
        <div className="about-banner">
          <img src={aboutImage} alt="about" className="content-img"/>
        </div>

        {/* 필드 이미지 그리드 영역 */}
        <div className="field-grid">
          <img src={field01Image} alt="field-01" className="grid-img"/>
          <img src={field02Image} alt="field-02" className="grid-img"/>
          <img src={field03Image} alt="field-03" className="grid-img"/>
          <img src={field04Image} alt="field-04" className="grid-img"/>
        </div>
      </div>
    </section>
  );
});

export default HomeSection;