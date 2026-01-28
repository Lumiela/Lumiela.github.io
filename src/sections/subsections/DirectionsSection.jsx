import React, { forwardRef } from 'react';
import content from '../../content/DirectionsContent.json';
import './DirectionsSection.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';

const DirectionsSection = forwardRef((props, ref) => {
  return (
    <section id="directions" className="directions-section section" ref={ref}>
      <div className="sub-section">
        {/* 상단 문구 */}
        <div className="directions-header">
          <h2>DAONRS는 여러분의 방문을 환영합니다.</h2>
          <p>방문을 원하신다면 아래 위치 정보를 참고해주세요.</p>
        </div>
        
        {/* 지도 영역 */}
        <div className="map-container">
          <div className="map-wrapper">
            <iframe 
              title="지도"
              src={content.googleMapEmbed}
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>       
          </div>
        </div>

        {/* 하단 상세 정보 UI */}
        <div className="info-layout">
          <div className="info-item address-full">
            <div className="icon-circle"><FaMapMarkerAlt /></div>
            <div className="info-text">
              <h3>Address</h3>
              <p>{content.address}</p>
            </div>
            <button 
              className="map-link-btn"
              onClick={() => {
                const encodedAddress = encodeURIComponent(content.address);
                const naverMapUrl = `https://map.naver.com/v5/search/${encodedAddress}`;
                window.open(naverMapUrl, '_blank');
              }}
              title="네이버 지도로 보기"
            >
              <FaExternalLinkAlt />네이버 지도로 보기
            </button>
          </div>

          <div className="contact-row">
            <div className="info-item">
              <div className="icon-circle"><FaPhoneAlt /></div>
              <div className="info-text">
                <h3>Tel</h3>
                <p>{content.phone}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="icon-circle"><FaEnvelope /></div>
              <div className="info-text">
                <h3>E-mail</h3>
                <p>{content.email || "saleskss@twim21.com"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default DirectionsSection;