import React, { forwardRef } from 'react';
import content from '../../content/DirectionsContent.json';
import {
  SubsectionTitleContainer,
  SubsectionTitle,
  DirectionsInfo,
  MapWrapper,
  CompanyImage,
  DirectionsContent
} from './styles/DirectionsSection.styles.js';

import daonrsImage from '../../assets/images/daonrs_img.jpg';

const DirectionsSection = forwardRef((props, ref) => {
  return (
    <section id="directions" className="section" ref={ref}>
      <div className="sub-section">
        <SubsectionTitleContainer>
          <SubsectionTitle>
            <span className="quote">“</span>
            {content.title}
            <span className="quote">”</span>
          </SubsectionTitle>
        </SubsectionTitleContainer>
        
        <DirectionsContent>
          <DirectionsInfo>
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
            
            <MapWrapper>
              <iframe 
                title="구글 지도 - (주)다온알에스"
                src={content.googleMapEmbed}
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>       
            </MapWrapper>

          </DirectionsInfo>
          
          <CompanyImage 
            src={daonrsImage} 
            alt="다온알에스 전경" 
          />
        </DirectionsContent>

      </div>
    </section>
  );
});

export default DirectionsSection;
