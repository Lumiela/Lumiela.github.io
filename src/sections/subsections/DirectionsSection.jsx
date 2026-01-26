import React, { forwardRef } from 'react';
import content from '../../content/DirectionsContent.json';
import './DirectionsSection.css'; // Import the new CSS file

import daonrsImage from '../../assets/images/daonrs_img.jpg';

const DirectionsSection = forwardRef((props, ref) => {
  return (
    <section id="directions" className="section" ref={ref}>
      <div className="sub-section">
        <div className="subsection-title-container">
          <p className="subsection-title">
            <span className="quote">“</span>
            {content.title}
            <span className="quote">”</span>
          </p>
        </div>
        
        <div className="directions-content">
          <div className="directions-info">
            <p>
              <strong>주소 :</strong> 
              <a 
                href={content.mapLink}
                target="_blank" 
                rel="noopener noreferrer"
              >
                {content.address} <strong>[지도보기]</strong>
              </a>
            </p>
            <p><strong>연락처:</strong> {content.phone}</p>
            
            <div className="map-wrapper">
              <iframe 
                title="구글 지도 - (주)다온알에스"
                src={content.googleMapEmbed}
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>       
            </div>

          </div>
          
          <img 
            src={daonrsImage} 
            alt="다온알에스 전경" 
            className="company-image"
          />
        </div>

      </div>
    </section>
  );
});

export default DirectionsSection;
