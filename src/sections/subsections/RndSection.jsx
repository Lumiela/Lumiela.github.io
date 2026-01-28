import React, { forwardRef } from 'react';
import rndImage from '../../assets/images/153967a69df72734c0b5d9845f6637ec_1588584439_0108.png';
import './RndSection.css';

const RndSection = forwardRef((props, ref) => {
  return (
    <section id="rnd" ref={ref} className="rnd-section-wrapper">
      <div className="sub-section">
        <div className="rnd-subsection-title-container">
          <p className="rnd-subsection-title">
            <span className="quote">“</span>
            연구개발
            <span className="quote">”</span>
          </p>
        </div>
        <img src={rndImage} alt="연구개발" className="rnd-image" />
      </div>
    </section>
  );
});

export default RndSection;