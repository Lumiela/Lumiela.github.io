import React, { forwardRef } from 'react';
import './AboutSubsections.css';

const DirectionsSection = forwardRef((props, ref) => {
  return (
    <section id="about-directions" className="section" ref={ref}>
      <div className="sub-section">
        <h2>오시는길</h2>
        <div className="directions-info">
          <p>
            <strong>주소 :</strong> 
            <a 
              href="https://naver.me/FAPr3dlK" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}              
            >
              광주 북구 용봉로 77 전남대학교 정비센터 다온알에스 <strong>[지도보기]</strong>
            </a>
          </p>
          <p><strong>연락처:</strong> 1811-6101</p>
          
          {/* 구글 지도 프레임 - 실제 작동 주소로 업데이트 */}
          <div className="map-wrapper" style={{ marginTop: '20px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <iframe 
              title="구글 지도 - (주)다온알에스"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3258.924296614488!2d126.9018311762886!3d35.176361372754644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35718c50dd50d377%3A0x3130b9863c26f2bf!2zKOyjvCnrTsmK3slYzsl5DsnbTsiqQ!5e0!3m2!1sko!2skr!4v1710000000000!5m2!1sko!2skr" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>       
          </div>

        </div>
        <img 
          src="src/assets/images/daonrs_img.jpg" 
          alt="다온알에스 전경" 
          className='company_pic' 
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
        />
      </div>
    </section>
  );
});

export default DirectionsSection;