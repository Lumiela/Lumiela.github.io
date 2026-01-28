import React, { forwardRef } from 'react';
import businessScopeImage from '../../assets/images/21_h.jpg';
import './ScopeSection.css';

const ScopeSection = forwardRef((props, ref) => {
  return (
    <section id="scope" ref={ref} className="scope-section-wrapper">
      <div className="sub-section">
        <img src={businessScopeImage} alt="사업 영역" className="scope-image" />
      </div>
    </section>
  );
});

export default ScopeSection;