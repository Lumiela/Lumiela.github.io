import React, { forwardRef } from 'react';
import './BusinessSubsections.css';
import businessScopeImage from '../../assets/images/21_h.jpg';

const ScopeSection = forwardRef((props, ref) => {
  return (
    <section id="business-scope" className="section" ref={ref}>
      <div className="sub-section">
        <img src={businessScopeImage} alt="사업 영역" className='business_area_img'/>
      </div>
    </section>
  );
});

export default ScopeSection;
