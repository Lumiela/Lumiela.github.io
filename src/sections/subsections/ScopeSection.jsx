import React, { forwardRef } from 'react';
import './BusinessSubsections.css';

const ScopeSection = forwardRef((props, ref) => {
  return (
    <section id="business-scope" className="section" ref={ref}>
      <div className="sub-section">
        <img src="src/assets/images/21_h.jpg" alt="사업 영역" className='business_area_img'/>
      </div>
    </section>
  );
});

export default ScopeSection;
