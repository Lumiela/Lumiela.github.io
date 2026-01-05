import React, { forwardRef } from 'react';
import './AboutSubsections.css';
import visionImage from '../../assets/images/11_h.jpg';

const VisionSection = forwardRef((props, ref) => {
  return (
    <section id="about-vision" className="section" ref={ref}>
      <div className="sub-section">
        <img src={visionImage} alt="경영 비전" className="company-vision" />
      </div>
    </section>
  );
});

export default VisionSection;
