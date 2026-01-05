import React, { forwardRef } from 'react';
import './BusinessSubsections.css';

const RndSection = forwardRef((props, ref) => {
  return (
    <section id="business-rnd" className="section" ref={ref}>
      <div className="sub-section">
        <div className="rnd-title-container">
          <p className="rnd-title">
            <span className="quote">“</span>
            연구개발
            <span className="quote">”</span>
          </p>
        </div>
        <img src="src/assets/images/153967a69df72734c0b5d9845f6637ec_1588584439_0108.png" 
        alt="연구개발" className='business_area_img'/>
      </div>
    </section>
  );
});

export default RndSection;
